import { UserService } from "@/core/domain/user/service/user.service";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class FrogotPassword_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService
   ) {
      super();
   }
   override async execute(oldEmail: string, newEmail: string): Promise<EndpointResult> {
      const userByEmail = this.userService.findUserByEmail(oldEmail);
      if (!userByEmail)
         return { statusCode: 404, statusMessage: "User not found" };

      // сгенерировать jwt
      // отправить письмо с jwt
      // ссылка по которой  надо перейти должна выглядеть так /auth/forgot-password/:jwt
      // тут мы этот jwt и ждем пока человек перейдет по ссылке
      // чтобы понять какой юзер перешел по ссылке нам нужно задекодить jwt
      // если он перрейдет по ней то он подтвердит владение емейлом и я разрешу поменять пароль
      // по ссылке get возвращает страничку, а post по этой ссылке меняет пароль

      // здесь мы просто отправляем письмо и отправляем юзеру уведомление что письмо отправлено

      return { statusCode: 200, statusMessage: "Password reset email sent" };
   }
}