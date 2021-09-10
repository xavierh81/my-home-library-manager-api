import { User } from "@models";
import { Response } from "express";

export type QueryContext = {
    user: User | null;
    refreshToken: string | null;
    res: Response
}