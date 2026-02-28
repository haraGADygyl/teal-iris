import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseUUIDPipe,
  Request,
} from "@nestjs/common";
import { ConnectionsService } from "./connections.service.js";
import { CreateConnectionDto } from "./dto/create-connection.dto.js";
import { UpdateConnectionStatusDto } from "./dto/update-connection-status.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller("connections")
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createConnectionDto: CreateConnectionDto) {
    return this.connectionsService.create(req.user.id, createConnectionDto);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateConnectionStatusDto,
    @Request() req,
  ) {
    return this.connectionsService.updateStatus(
      id,
      updateDto.status,
      req.user.id,
    );
  }
}
