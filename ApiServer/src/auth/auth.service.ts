import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ethers } from 'ethers';
import { Modules } from 'src/app.constants';
import { ConfigService } from 'src/config/config.service';

export interface JwtPayload {
  userId: string;
  // TODO: Add Role or permissions here
}

export interface LoginResponse {
  accessToken: string;
}

export interface AccessPermit {
  permit: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(Modules.EthersProvider)
    private readonly ethersProvider: ethers.providers.Provider,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async generatePermit(ethAddress): Promise<AccessPermit> {
    const serverAccountWallet = await ethers.Wallet.fromMnemonic(
      this.config.get('serverWallet').mnemonic,
    );
    const returnMessage = await serverAccountWallet.signMessage(
      `${this.config.get('jwt').permitSalt} - ${ethAddress.toLowerCase()}`,
    );
    return { permit: returnMessage };
  }

  async validateUserSignature(signedMessage, ethAddress): Promise<boolean> {
    const { permit } = await this.generatePermit(ethAddress);
    try {
      const addressOfSigner = await ethers.utils.verifyMessage(
        permit,
        signedMessage,
      );
      return addressOfSigner.toLowerCase() === ethAddress.toLowerCase();
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login(signedPermit: string, ethAddress: string): Promise<LoginResponse> {

    const isSignatureValid = await this.validateUserSignature(signedPermit, ethAddress);
    if (!isSignatureValid) {
      throw new UnauthorizedException('Invalid message signature');
    }

    const _user = await this.userService.getUserByEthAddress(ethAddress);
    let user;

    if (_user) {
      user = _user;
    } else {
      const newUser = await this.userService.create(ethAddress);
      user = newUser;
    }

    // TODO get expiry from config
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        // TODO: Roles, or similar
      },
      {
        expiresIn: `${this.config.get('jwt').expiry}h`,
        notBefore: '0',
        subject: ethAddress,
        issuer: this.config.get('app').host,
      },
    );

    return { accessToken };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.findById(payload.userId);
  }
}
