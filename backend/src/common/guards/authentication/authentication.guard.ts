import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const auth = request.headers.authorization;

        if (!auth) {
            throw new UnauthorizedException();
        }

        const token = auth.replace('Bearer ', '');

        try {
            const payload = await this.jwtService.verifyAsync(token);

            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
}