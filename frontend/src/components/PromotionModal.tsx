import React from 'react';

interface PromotionModalProps {
    isVisible: boolean;
    color: 'white' | 'black';
    onPromote: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

const promotionPieces = {
    white: {
        q: '♕', // Queen
        r: '♖', // Rook
        b: '♗', // Bishop
        n: '♘'  // Knight
    },
    black: {
        q: '♛', // Queen
        r: '♜', // Rook
        b: '♝', // Bishop
        n: '♞'  // Knight
    }
};

const pieceNames = {
    q: 'Queen',
    r: 'Rook',
    b: 'Bishop',
    n: 'Knight'
};

export const PromotionModal: React.FC<PromotionModalProps> = ({ isVisible, color, onPromote }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Pawn Promotion
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Choose which piece you want to promote your pawn to:
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {(Object.keys(promotionPieces[color]) as Array<keyof typeof promotionPieces[typeof color]>).map((piece) => (
                        <button
                            key={piece}
                            onClick={() => onPromote(piece)}
                            className="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <div className="text-6xl mb-2" style={{ fontFamily: "'Segoe UI Symbol', 'Arial Unicode MS', Arial, sans-serif" }}>
                                {promotionPieces[color][piece]}
                            </div>
                            <span className="text-lg font-semibold text-gray-700">
                                {pieceNames[piece]}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Click on the piece you want to promote to
                    </p>
                </div>
            </div>
        </div>
    );
}; 