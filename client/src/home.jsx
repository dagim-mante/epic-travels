import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-screen background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/banner.jpg")',
        }}
      />
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Navigation bar */}
      <nav className="bg-white absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <Link to="/" className="text-white text-2xl font-bold">
          <span className="sr-only">Epic Travels Logo</span>
          <img src="/logo.png" className="w-36 h-24" alt="Logo" />
        </Link>
        <Link 
          to="/chat" 
          className="px-4 py-2 text-white border border-white rounded bg-blue-700 hover:bg-blue-900 hover:text-white transition-colors"
        >
          Get Started
        </Link>
      </nav>
      
      {/* Main content */}
      <main className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 drop-shadow-lg">Epic Travels</h1>
        <p className="text-2xl sm:text-3xl md:text-4xl drop-shadow-md">Revolutionizing Travel with AI</p>
      </main>
    </div>
  );
};

export default Home;