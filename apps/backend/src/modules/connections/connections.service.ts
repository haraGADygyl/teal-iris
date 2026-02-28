import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
  ForbiddenException,
} from "@nestjs/common";
import { eq, and, or } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema.js";
import { DRIZZLE } from "../../db/db.module.js";
import { ConnectionStatus, connections, users } from "../../db/schema.js";
import { CreateConnectionDto } from "./dto/create-connection.dto.js";

@Injectable()
export class ConnectionsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(senderId: string, createConnectionDto: CreateConnectionDto) {
    const { receiverId } = createConnectionDto;

    if (senderId === receiverId) {
      throw new BadRequestException(
        "You cannot send a connection request to yourself",
      );
    }
    const receiver = await this.db.query.users.findFirst({
      where: eq(users.id, receiverId),
    });

    if (!receiver) {
      throw new NotFoundException("Receiver user not found");
    }

    // Check if a connection already exists
    const existingConnection = await this.db.query.connections.findFirst({
      where: or(
        and(
          eq(connections.senderId, senderId),
          eq(connections.receiverId, receiverId),
        ),
        and(
          eq(connections.senderId, receiverId),
          eq(connections.receiverId, senderId),
        ),
      ),
    });

    if (existingConnection) {
      throw new ConflictException(
        "A connection request already exists or you are already connected",
      );
    }

    const [newConnection] = await this.db
      .insert(connections)
      .values({
        senderId,
        receiverId,
        status: ConnectionStatus.PENDING,
      })
      .returning();

    return newConnection;
  }
  async updateStatus(
    connectionId: string,
    status: ConnectionStatus.ACCEPTED | ConnectionStatus.REJECTED,
    currentUserId: string,
  ) {
    const connection = await this.db.query.connections.findFirst({
      where: eq(connections.id, connectionId),
    });

    if (!connection) {
      throw new NotFoundException("Connection request not found");
    }

    if (connection.receiverId !== currentUserId) {
      throw new ForbiddenException(
        "Only the receiver can accept or reject this request",
      );
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException(
        `Cannot update connection with status: ${connection.status}`,
      );
    }

    const [updatedConnection] = await this.db
      .update(connections)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(connections.id, connectionId))
      .returning();

    return updatedConnection;
  }
}
