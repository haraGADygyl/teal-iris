import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";

@Controller("api/auth")
export class AuthController {
  // Step 1: Redirect user to Google login
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Guard handles the redirect automatically
  }

  // Step 2: Handle Google callback
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // req.user is populated by GoogleStrategy validate()
    // Here you can generate JWT and redirect frontend
    const _user = req.user;
    // Example redirect
    res.redirect(`http://localhost:3000/auth/callback?token=FAKE_TOKEN`);
  }
}
