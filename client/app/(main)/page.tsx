import { signOut } from "../actions/auth.actions";

const MainPage = () => {
  return <div className="flex flex-col w-full h-screen">
    <nav className="w-full max-h-16 flex items-center p-4 bg-foreground border-background border-b-2 gap-4">
      <h1 className="font-bold text-2xl">Main Page</h1>
    </nav>
    <div className="flex flex-col grow overflow-y-auto bg-foreground">
      <p className="p-4">Welcome to the main page!</p>
      <button onClick={signOut} className="bg-red-600 text-white px-4 py-2 rounded-md m-4 hover:bg-red-700 w-32 text-center">Sign Out</button>
    </div>
  </div>;
}

export default MainPage;
