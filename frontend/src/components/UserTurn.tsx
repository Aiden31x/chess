export const UserTurn = ({ user }: { user: string }) => {
    return (
        <div className="text-2xl font-bold text-center bg-gray-300 p-4 rounded-lg">
            <h1>  {user === 'w' ? 'White' : 'Black'} 's Turn</h1>
        </div>
    )
}