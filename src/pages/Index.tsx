import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const swiperModules = [Pagination, Autoplay, Navigation];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-black border-b border-gray-800' : 'bg-white border-b border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-white">
              <span className="text-red-600">ESPN</span>+
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`text-sm font-medium ${activeTab === "featured" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("featured")}>Featured</Link>
              <Link to="/live-ipl" className={`text-sm font-medium ${activeTab === "live-ipl" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("live-ipl")}>LIVE IPL</Link>
              <a href="#" className={`text-sm font-medium ${activeTab === "originals" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("originals")}>Originals</a>
              <a href="#" className={`text-sm font-medium ${activeTab === "browse" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("browse")}>Browse</a>
              <a href="#" className={`text-sm font-medium ${activeTab === "schedule" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("schedule")}>Schedule & Replays</a>
              <a href="#" className={`text-sm font-medium ${activeTab === "articles" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("articles")}>Articles</a>
              <a href="#" className={`text-sm font-medium ${activeTab === "tools" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("tools")}>Tools</a>
              <a href="#" className={`text-sm font-medium ${activeTab === "support" ? "text-white" : "text-gray-400 hover:text-white"} cursor-pointer`} onClick={() => setActiveTab("support")}>Support & FAQs</a>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="h-full"
          >
            {[
              {
                src: "https://readdy.ai/api/search-image?query=vibrant%20football%20match%20action%20shot%20with%20bright%20stadium%20lighting%20and%20clear%20visibility%2C%20professional%20NFL%20game%20with%20players%20in%20motion%2C%20energetic%20sports%20photography%20with%20balanced%20lighting%20and%20clean%20atmosphere&width=1440&height=600&seq=10&orientation=landscape",
                alt: "Football Match"
              },
              {
                src: "https://readdy.ai/api/search-image?query=dynamic%20basketball%20game%20moment%20with%20players%20jumping%20for%20slam%20dunk%2C%20NBA%20arena%20with%20bright%20balanced%20lighting%20and%20clear%20visibility%20of%20players%20and%20crowd%2C%20energetic%20atmosphere&width=1440&height=600&seq=11&orientation=landscape",
                alt: "Basketball Game"
              },
              {
                src: "https://readdy.ai/api/search-image?query=IPL%20cricket%20match%20with%20packed%20stadium%2C%20dramatic%20evening%20lighting%2C%20intense%20batting%20moment%20with%20clear%20visibility%20of%20players%20and%20colorful%20team%20jerseys%2C%20vibrant%20Indian%20Premier%20League%20atmosphere&width=1440&height=600&seq=12&orientation=landscape",
                alt: "IPL Match"
              },
              {
                src: "https://readdy.ai/api/search-image?query=PSL%20cricket%20tournament%20with%20dramatic%20stadium%20lighting%2C%20Pakistan%20Super%20League%20match%20moment%20with%20clear%20visibility%20of%20players%20in%20action%2C%20energetic%20crowd%20and%20vibrant%20atmosphere&width=1440&height=600&seq=13&orientation=landscape",
                alt: "PSL Match"
              },
              {
                src: "https://readdy.ai/api/search-image?query=ICC%20Cricket%20World%20Cup%20final%20match%20with%20packed%20international%20stadium%2C%20dramatic%20lighting%20and%20intense%20game%20moment%2C%20clear%20visibility%20of%20players%20in%20national%20jerseys%2C%20global%20cricket%20championship%20atmosphere&width=1440&height=600&seq=14&orientation=landscape",
                alt: "Cricket World Cup"
              },
              {
                src: "https://readdy.ai/api/search-image?query=soccer%20stadium%20with%20intense%20match%20moment%20in%20bright%20daylight%2C%20professional%20football%20players%20in%20clear%20action%20with%20vibrant%20atmosphere%20and%20energetic%20crowd%2C%20high%20key%20sports%20photography&width=1440&height=600&seq=15&orientation=landscape",
                alt: "Soccer Match"
              }
            ].map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Step Up Your Streaming Game with ESPN+</h1>
            <p className="text-lg md:text-xl mb-6 text-white/90 drop-shadow-md">Sign up now to access live sports, the full 30 for 30 library, and originals</p>
            <p className="text-xl font-bold mb-8 text-white drop-shadow-md">Only $10.99 a month</p>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-6 text-lg !rounded-button whitespace-nowrap cursor-pointer shadow-lg">WATCH IPL LIVE</Button>
            <div className="mt-8 flex flex-wrap gap-4">
              <Badge className="bg-red-600 py-1 px-3 text-white">LIVE GAMES</Badge>
              <Badge className="bg-blue-600 py-1 px-3 text-white">EXCLUSIVE CONTENT</Badge>
              <Badge className="bg-purple-600 py-1 px-3 text-white">ORIGINALS</Badge>
              <Badge className="bg-green-600 py-1 px-3 text-white">DOCUMENTARIES</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Live Now Section */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold tracking-tight">Live Now</h2>
              <div className="flex items-center bg-red-600/10 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="ml-2 text-sm font-semibold text-red-600">LIVE</span>
              </div>
            </div>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap">
              <i className="fas fa-play-circle mr-2"></i>View All Live Events
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "NBA Playoffs: Game 5",
                teams: "Boston Celtics vs Indiana Pacers",
                image: "https://readdy.ai/api/search-image?query=intense%20basketball%20game%20action%20shot%20with%20players%20jumping%20for%20the%20ball%2C%20dramatic%20arena%20lighting%2C%20professional%20NBA%20match%20atmosphere%20with%20crowd%20in%20background&width=400&height=225&seq=31&orientation=landscape",
                viewers: "234K",
                quarter: "Q3 8:24",
                score: "87-82"
              },
              {
                title: "UEFA Champions League",
                teams: "Manchester City vs Real Madrid",
                image: "https://readdy.ai/api/search-image?query=soccer%20stadium%20with%20intense%20match%20moment%20between%20two%20top%20teams%2C%20dramatic%20evening%20lighting%2C%20professional%20football%20match%20with%20passionate%20crowd&width=400&height=225&seq=32&orientation=landscape",
                viewers: "456K",
                quarter: "65'",
                score: "2-1"
              },
              {
                title: "MLB: Regular Season",
                teams: "NY Yankees vs Houston Astros",
                image: "https://readdy.ai/api/search-image?query=baseball%20stadium%20with%20dramatic%20evening%20game%20moment%2C%20professional%20MLB%20match%20atmosphere%20with%20players%20in%20action%20and%20crowd%20cheering&width=400&height=225&seq=33&orientation=landscape",
                viewers: "128K",
                quarter: "7th Inning",
                score: "5-3"
              }
            ].map((game, index) => (
              <div key={index} className={`relative group cursor-pointer overflow-hidden rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="relative">
                  <img src={game.image} alt={game.title} className="w-full aspect-video object-cover" />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1"></div>
                    LIVE
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <i className="fas fa-user mr-1"></i> {game.viewers}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{game.title}</h3>
                    <Badge className="bg-red-600">{game.quarter}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{game.teams}</span>
                    <span className="font-bold">{game.score}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="bg-red-600 hover:bg-red-700 !rounded-button whitespace-nowrap">
                    Watch Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cricket Channel Partners */}
      <section className={`py-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={7}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="streaming-partners-slider"
            breakpoints={{
              320: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 7 },
            }}
          >
            {[
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20Sky%20Sports%20Cricket%20HD%20with%20modern%20typography%20and%20cricket%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=101&orientation=squarish",
                text: "Sky Sports Cricket HD"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20Star%20Sports%20HD%20with%20modern%20typography%20and%20dynamic%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=102&orientation=squarish",
                text: "Star Sports HD"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20Star%20Sports%20HD%20Hindi%20with%20modern%20typography%20and%20Indian%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=103&orientation=squarish",
                text: "Star Sports HD Hindi"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20Willow%20Cricket%20HD%20with%20modern%20typography%20and%20cricket%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=104&orientation=squarish",
                text: "Willow Cricket HD"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20PTV%20Sports%20with%20modern%20typography%20and%20Pakistani%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=105&orientation=squarish",
                text: "PTV Sports"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20Willow%20Cricket%20Extra%20with%20modern%20typography%20and%20cricket%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=106&orientation=squarish",
                text: "Willow Cricket Extra"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20A%20Sports%20HD%20with%20modern%20typography%20and%20dynamic%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=107&orientation=squarish",
                text: "A Sports HD"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20Fox%20Cricket%20501%20HD%20with%20modern%20typography%20and%20Australian%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=108&orientation=squarish",
                text: "Fox Cricket 501 HD"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20SuperSports%20Cricket%20with%20modern%20typography%20and%20African%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=109&orientation=squarish",
                text: "SuperSports Cricket"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20TEN%201%20with%20modern%20typography%20and%20dynamic%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=110&orientation=squarish",
                text: "TEN 1"
              },
              {
                image: "https://readdy.ai/api/search-image?query=professional%20sports%20channel%20logo%20design%20for%20TEN%20Sports%20pk%20with%20modern%20typography%20and%20Pakistani%20elements%20on%20clean%20background%20with%20curved%20dynamic%20shape&width=300&height=300&seq=111&orientation=squarish",
                text: "TEN Sports pk"
              }
            ].map((partner, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center h-32 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={partner.image} alt={partner.text} className="h-24 w-24 object-contain rounded-full bg-gray-800/50 p-4" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Sports Categories */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Football", icon: "football-ball" },
              { name: "Basketball", icon: "basketball-ball" },
              { name: "Baseball", icon: "baseball-ball" },
              { name: "Hockey", icon: "hockey-puck" },
              { name: "Soccer", icon: "futbol" },
              { name: "UFC", icon: "fist-raised" },
            ].map((sport, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-3">
                  <i className={`fas fa-${sport.icon} text-2xl`}></i>
                </div>
                <h3 className="font-medium">{sport.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks Section */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">For You</h2>
            <Button variant="link" className="text-gray-400 hover:text-white cursor-pointer whitespace-nowrap text-sm">View All</Button>
          </div>
          <Swiper
            modules={swiperModules}
            spaceBetween={16}
            slidesPerView={1.2}
            navigation
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.2 },
              1280: { slidesPerView: 5.2 },
            }}
            className="overflow-visible"
          >
            {[
              {
                title: "Week 9: Bucs vs Chiefs",
                image: "https://readdy.ai/api/search-image?query=sports%20analysis%20show%20set%20with%20two%20hosts%20discussing%20NFL%20game%2C%20professional%20studio%20lighting%2C%20high%20end%20broadcast%20production&width=300&height=169&seq=21&orientation=landscape",
                time: "ESPN+ • NFL",
                network: "ESPN+"
              },
              {
                title: "Edmonton Oilers vs. Nashville Predators",
                image: "https://readdy.ai/api/search-image?query=professional%20hockey%20game%20action%20shot%2C%20NHL%20players%20in%20motion%2C%20dramatic%20arena%20lighting%2C%20sports%20broadcast%20quality&width=300&height=169&seq=22&orientation=landscape",
                time: "ESPN+ • NHL",
                network: "ESPN+"
              },
              {
                title: "Riddick Me This - Week 9: National Fight Club 109",
                image: "https://readdy.ai/api/search-image?query=football%20analysis%20show%20set%20with%20expert%20commentator%2C%20professional%20studio%20environment%2C%20sports%20broadcast%20production&width=300&height=169&seq=23&orientation=landscape",
                time: "ESPN+ • NFL",
                network: "ESPN+"
              },
              {
                title: "Kick Start",
                image: "https://readdy.ai/api/search-image?query=womens%20soccer%20documentary%20title%20card%2C%20artistic%20black%20and%20white%20sports%20photography%2C%20professional%20production%20still&width=300&height=169&seq=24&orientation=landscape",
                time: "ESPN+ • NCAA Women's Soccer",
                network: "ESPN+"
              },
              {
                title: "The Freddie Freeman Story",
                image: "https://readdy.ai/api/search-image?query=baseball%20documentary%20collage%20style%20image%20with%20vintage%20photos%20and%20modern%20action%20shots%2C%20professional%20sports%20storytelling&width=300&height=169&seq=25&orientation=landscape",
                time: "ESPN+ • MLB",
                network: "ESPN+"
              }
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <Card className={`border-0 overflow-hidden h-full cursor-pointer bg-transparent hover:bg-gray-800 transition-all duration-300`}>
                  <div className="relative">
                    <img src={item.image} alt={item.title} className="w-full aspect-video object-cover object-center rounded" />
                  </div>
                  <CardContent className="p-2">
                    <h3 className="font-medium text-sm mb-1 line-clamp-1 text-white">{item.title}</h3>
                    <div className="text-xs text-gray-400">{item.time}</div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Featured Content */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-lg cursor-pointer group">
              <img
                src="https://readdy.ai/api/search-image?query=dramatic%20documentary%20film%20scene%2C%2030%20for%2030%20ESPN%20style%2C%20cinematic%20quality%2C%20sports%20history%20moment%2C%20emotional%20storytelling%2C%20professional%20film%20production%20still&width=600&height=350&seq=8&orientation=landscape"
                alt="30 for 30 Documentary"
                className="w-full h-80 object-cover object-top group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <Badge className="bg-red-600 mb-3">30 FOR 30</Badge>
                <h3 className="text-2xl font-bold mb-2">The Dynasty That Changed Basketball</h3>
                <p className="text-gray-300">The untold story of how a team of underdogs revolutionized the game forever.</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg cursor-pointer group">
              <img
                src="https://readdy.ai/api/search-image?query=exclusive%20sports%20interview%20setting%2C%20professional%20athlete%20with%20interviewer%2C%20studio%20lighting%2C%20ESPN+%20original%20content%2C%20high%20production%20value&width=600&height=350&seq=9&orientation=landscape"
                alt="ESPN+ Original"
                className="w-full h-80 object-cover object-top group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <Badge className="bg-purple-600 mb-3">ESPN+ ORIGINAL</Badge>
                <h3 className="text-2xl font-bold mb-2">Inside the Mind of Champions</h3>
                <p className="text-gray-300">An exclusive look at the mental preparation of elite athletes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
