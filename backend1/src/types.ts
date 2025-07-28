export interface GameError {
    type: string;
    message: string;
    code?: string;
}

export interface MoveValidation {
    from: string;
    to: string;
    promotion?: string;
}
