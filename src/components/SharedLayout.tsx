
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SharedLayout = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState("featured");

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark', theme === 'light');
    document.documentElement.classList.toggle('light', theme === 'dark');
  };

  return (
    <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-black border-b border-gray-800' : 'bg-white border-b border-gray-200'}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-white">
            <span className="text-red-600">ESPN</span>+
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium ${activeTab === "featured" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("featured")}>Featured</Link>
            <Link to="/live-ipl" className={`text-sm font-medium ${activeTab === "live-ipl" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("live-ipl")}>LIVE IPL</Link>
            <Link to="#" className={`text-sm font-medium ${activeTab === "originals" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("originals")}>Originals</Link>
            <Link to="#" className={`text-sm font-medium ${activeTab === "browse" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("browse")}>Browse</Link>
            <Link to="#" className={`text-sm font-medium ${activeTab === "schedule" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("schedule")}>Schedule & Replays</Link>
            <Link to="#" className={`text-sm font-medium ${activeTab === "articles" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("articles")}>Articles</Link>
            <Link to="#" className={`text-sm font-medium ${activeTab === "tools" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("tools")}>Tools</Link>
            <Link to="#" className={`text-sm font-medium ${activeTab === "support" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("support")}>Support & FAQs</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
            onClick={toggleTheme}
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className={`w-40 h-8 border-none text-sm rounded-full pl-8 focus:ring-1 focus:ring-red-600 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
            />
            <i className="fas fa-search absolute left-3 top-2 text-gray-400 text-sm"></i>
          </div>
          <Button variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-none !rounded-button whitespace-nowrap">Sign In</Button>
        </div>
      </div>
    </header>
  );
};

export default SharedLayout;
