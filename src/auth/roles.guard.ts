import Role from './role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();

      const user = req.user;

      return user.role === role;
    }
  }
  return mixin(RoleGuardMixin);
};
export default RoleGuard;
