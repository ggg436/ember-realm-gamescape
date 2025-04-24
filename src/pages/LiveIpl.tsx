import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LiveIpl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [currentChannelInfo, setCurrentChannelInfo] = useState({
    title: "इंडिया टीवी लाइव",
    description: "यह होस्ट कई महत्वपूर्ण और उभरते हुए सार्वजनिक हित के मुद्दों पर प्रकाश डालता है जिनमें विस्तृत चर्चा की आवश्यकता होती है...",
    image: "https://readdy.ai/api/search-image?query=Indian%20prime%20minister%20giving%20a%20speech%20at%20a%20formal%20event%20with%20traditional%20decorations%2C%20news%20broadcast%20style%20with%20overlay%20graphics%2C%20professional%20lighting%2C%20high%20quality%20news%20footage%2C%20breaking%20news%20banner%20visible&width=800&height=450&seq=1&orientation=landscape",
    breakingNews: "मोदी को भारत भी सुन रहा...पाकिस्तान भी सुन रहा"
  });

  const channels = [
    {
      id: 1,
      name: "आज तक",
      logo: "fa-solid fa-tv",
      live: true
    },
    {
      id: 2,
      name: "इंडिया टीवी",
      logo: "fa-solid fa-tv",
      live: true
    },
    {
      id: 3,
      name: "ज़ी न्यूज़",
      logo: "fa-solid fa-tv",
      live: true
    },
    {
      id: 4,
      name: "एबीपी न्यूज़",
      logo: "fa-solid fa-tv",
      live: true
    },
    {
      id: 5,
      name: "एनडीटीवी",
      logo: "fa-solid fa-tv",
      live: false
    },
    {
      id: 6,
      name: "रिपब्लिक भारत",
      logo: "fa-solid fa-tv",
      live: true
    },
    {
      id: 7,
      name: "न्यूज़ 24",
      logo: "fa-solid fa-tv",
      live: true
    },
    {
      id: 8,
      name: "टाइム्स नाउ",
      logo: "fa-solid fa-tv",
      live: false
    }
  ];

  const newsItems = [
    {
      id: 1,
      title: "प्रधानमंत्री मोदी का संबोधन: भारत की विकास यात्रा",
      time: "02:08",
      channel: "इंडिया टीवी लाइव"
    },
    {
      id: 2,
      title: "कोरोना के खिलाफ लड़ाई: नई वैक्सीन की घोषणा",
      time: "05:30",
      channel: "आज तक"
    },
    {
      id: 3,
      title: "किसान आंदोलन: सरकार का नया प्रस्ताव",
      time: "03:45",
      channel: "ज़ी न्यूज़"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying && currentTime < duration) {
        setCurrentTime(prev => prev + 1);
      } else if (currentTime >= duration) {
        setCurrentTime(0);
        setIsPlaying(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, currentTime, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  return (
    <div className="flex-1 bg-gray-900">
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-gray-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">चैनल्स</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 grid grid-cols-2 gap-4">
              {channels.map((channel, index) => (
                <DropdownMenu key={channel.id}>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`relative w-full h-24 cursor-pointer transition-all ${
                        selectedChannel === index ? 'scale-105' : ''
                      }`}
                      onClick={() => {
                        setSelectedChannel(index);
                        if (channel.name === "ज़ी न्यूज़") {
                          setCurrentChannelInfo({
                            title: "ज़ी न्यूज़ लाइव",
                            description: "ज़ी न्यूज़ भारत का प्रमुख हिंदी न्यूज़ चैनल है जो 24x7 ताज़ा खबरें और विश्लेषण प्रदान करता है।",
                            image: "https://readdy.ai/api/search-image?query=Professional%20news%20studio%20setup%20with%20modern%20LED%20screens%20showing%20Zee%20News%20branding%2C%20news%20anchors%20desk%2C%20high%20end%20broadcasting%20equipment%2C%20dynamic%20lighting&width=800&height=450&seq=2&orientation=landscape",
                            breakingNews: "ज़ी न्यूज़ पर आज की सबसे बड़ी खबरें"
                          });
                        }
                      }}
                    >
                      <div className={`w-full h-full rounded-lg flex items-center justify-center ${
                        selectedChannel === index ? 'bg-red-600' : 'bg-gray-700'
                      }`}>
                        <div className="text-center">
                          <i className={`${channel.logo} text-4xl text-white mb-2`}></i>
                          <p className="text-white text-sm mt-2">{channel.name}</p>
                        </div>
                      </div>
                      {channel.live && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-sm border-2 border-gray-800"></span>
                      )}
                      {selectedChannel === index && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-red-600 rounded-full"></div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-expand mr-2"></i>पूर्ण स्क्रीन पर देखें
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-plus mr-2"></i>अपनी प्लेलिस्ट में जोड़ें
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-calendar mr-2"></i>शेड्यूल देखें
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-info-circle mr-2"></i>चैनल की जानकारी
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                      <i className="fas fa-flag mr-2"></i>रिपोर्ट करें
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <div className="flex-1 flex flex-col">
          <div className="relative flex-1 bg-black">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent h-16 z-10 flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="bg-red-600 text-white px-3 py-1 rounded font-bold mr-2">
                  ब्रेकिंग न्यूज़
                </div>
                <span className="text-sm">मंगलवार से शनिवार LIVE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white !rounded-button whitespace-nowrap">
                  <i className="fas fa-share-alt"></i>
                </Button>
                <Button variant="ghost" size="sm" className="text-white !rounded-button whitespace-nowrap">
                  <i className="fas fa-heart"></i>
                </Button>
              </div>
            </div>
            <div className="relative w-full h-full">
              <iframe 
                src="//stream.crichd.sc/update/skys2.php" 
                className="w-full h-[500px]"
                frameBorder="0"
                allowFullScreen
                allow="encrypted-media"
                sandbox="allow-same-origin allow-scripts allow-presentation"
              />
              <div className="absolute bottom-24 left-0 right-0 bg-red-800 text-white py-2 px-4">
                <h2 className="text-xl font-bold">{currentChannelInfo.breakingNews}</h2>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="sm"
                    className="text-white !rounded-button whitespace-nowrap"
                  >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </Button>
                  <span className="text-sm mx-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="sm"
                    className="text-white !rounded-button whitespace-nowrap"
                  >
                    <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={toggleFullscreen}
                    variant="ghost"
                    size="sm"
                    className="text-white !rounded-button whitespace-nowrap"
                  >
                    <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                  </Button>
                </div>
              </div>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleTimeChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-tv text-white"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentChannelInfo.title}</h2>
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="mr-2">प्रहर</span>
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    <span className="mr-2">लाइव</span>
                    <span className="text-gray-400">|</span>
                    <span className="ml-2">YuppTV</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="mr-2 !rounded-button whitespace-nowrap">
                  <i className="fas fa-heart mr-1"></i> पसंदीदा में जोड़ें
                </Button>
                <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap">
                  <i className="fas fa-thumbs-up mr-1"></i> पसंद
                </Button>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              {currentChannelInfo.description}
              <Button variant="link" className="text-red-400 p-0 h-auto !rounded-button whitespace-nowrap">और दिखाएं</Button>
            </p>
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-3">अन्य चैनल्स</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {channels.slice(0, 4).map((channel) => (
                  <div key={channel.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 bg-gray-600 flex items-center justify-center">
                        <i className={`${channel.logo} text-3xl text-white`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">{channel.name}</h4>
                        {channel.live && (
                          <div className="flex items-center text-xs text-gray-300">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            लाइव
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveIpl;
