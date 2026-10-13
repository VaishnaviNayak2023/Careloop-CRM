import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken } from '../../lib/auth';
import { LoginInput, SignupInput } from './auth.schema';

const prisma = new PrismaClient();

export class AuthService {
  async signup(data: SignupInput) {
    const { email, password, fullName, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        accountStatus: role === 'CUSTOMER' ? 'ACTIVE' : 'PENDING'
      }
    });

    // Create role-specific profile
    if (role === 'CUSTOMER') {
      await prisma.customer.create({
        data: {
          userId: user.id,
          name: fullName,
          email,
          status: 'active'
        }
      });
    } else if (role === 'STAFF_ADMIN') {
      await prisma.staffAdmin.create({
        data: {
          userId: user.id
        }
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        accountStatus: user.accountStatus
      },
      token
    };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Check account status
    if (user.accountStatus !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        accountStatus: user.accountStatus
      },
      token
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerProfile: true,
        staffProfile: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      accountStatus: user.accountStatus,
      customerProfile: user.customerProfile,
      staffProfile: user.staffProfile
    };
  }
}
