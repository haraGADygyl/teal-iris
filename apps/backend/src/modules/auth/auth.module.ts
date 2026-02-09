import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy.js"; // path to your strategy
import { AuthController } from "./auth.controller.js";

@Module({
  imports: [PassportModule],
  providers: [GoogleStrategy],
  controllers: [AuthController],
  exports: [GoogleStrategy],
})
export class AuthModule {}
