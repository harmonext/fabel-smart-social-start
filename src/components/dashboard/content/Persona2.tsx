import { useState } from "react";

interface PlatformData {
  name: string;
  icon: string;
  color: string;
  content: string;
}

interface GeneratedContent {
  platform: string;
  text: string;
}

const Persona2 = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditingPlatform, setCurrentEditingPlatform] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const platformData: Record<string, PlatformData> = {
    linkedin: {
      name: 'LinkedIn',
      icon: 'fa-brands fa-linkedin',
      color: 'text-[#0077B5]',
      content: `Looking to advance your career? Our professional development programs help ambitious professionals like you reach the next level. Connect with industry leaders and unlock your potential. #CareerGrowth #ProfessionalDevelopment #Leadership`,
    },
    twitter: {
      name: 'Twitter/X',
      icon: 'fa-brands fa-x-twitter',
      color: 'text-brand-dark',
      content: `🚀 Ready to level up your career game? Our mentorship programs connect you with top executives who've been where you want to go. Apply now! #CareerGoals #Mentorship #Success`,
    },
    youtube: {
      name: 'YouTube',
      icon: 'fa-brands fa-youtube',
      color: 'text-[#FF0000]',
      content: `Watch how our alumni went from entry-level to C-suite in just 5 years! Get the insider strategies that transformed their careers. Subscribe for more success stories! #CareerTransformation #ExecutiveCoaching`,
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerateContent = () => {
    if (selectedPlatforms.length === 0) {
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);

    setTimeout(() => {
      const content = selectedPlatforms.map(platform => ({
        platform,
        text: platformData[platform].content
      }));
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 1500);
  };

  const handleEditContent = (platform: string) => {
    const currentContent = generatedContent.find(c => c.platform === platform);
    setCurrentEditingPlatform(platform);
    setModalText(currentContent?.text || '');
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    if (currentEditingPlatform) {
      setGeneratedContent(prev => 
        prev.map(content => 
          content.platform === currentEditingPlatform 
            ? { ...content, text: modalText }
            : content
        )
      );
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEditingPlatform(null);
    setModalText("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen">
      <main className="w-full max-w-4xl mx-auto space-y-8">
        {/* Persona Card */}
        <div className="bg-brand-gray text-brand-dark rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Persona 2</h1>
                <p className="text-xl font-medium text-gray-700">Ambitious Professional</p>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-1">Location:</h2>
                <p className="text-base">
                  Chicago, Atlanta, Dallas<br />
                  Major business hubs and corporate centers
                </p>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-1">Psychographics:</h2>
                <p className="text-base">
                  This persona is career-focused and seeks opportunities for professional growth and networking. They value leadership development and industry recognition.
                </p>
              </div>

              <div className="flex space-x-12">
                <div>
                  <h2 className="font-bold text-lg">Age Range:</h2>
                  <p className="text-base">28-42</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Gender:</h2>
                  <p className="text-base">Mixed</p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-lock text-2xl text-brand-dark"></i>
                  <h2 className="font-bold text-lg">Unlock for:</h2>
                </div>
                <ul className="list-none mt-2 space-y-1 text-base">
                  <li>SEO Keywords</li>
                  <li>Competitor Analysis</li>
                  <li>Estimated CAC</li>
                  <li>Estimated LTV</li>
                  <li>How to appeal to persona</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Ad Content Generation */}
            <div className="bg-gray-300/50 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="font-bold text-lg mb-3">Social Media Platforms:</h2>
                <div className="flex items-center justify-around">
                  <label className="flex flex-col items-center space-y-2 cursor-pointer">
                    <i className="fa-brands fa-linkedin text-3xl text-[#0077B5]"></i>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded text-brand-blue focus:ring-brand-blue"
                      checked={selectedPlatforms.includes('linkedin')}
                      onChange={() => handlePlatformToggle('linkedin')}
                    />
                  </label>
                  <label className="flex flex-col items-center space-y-2 cursor-pointer">
                    <i className="fa-brands fa-x-twitter text-3xl text-brand-dark"></i>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded text-brand-blue focus:ring-brand-blue"
                      checked={selectedPlatforms.includes('twitter')}
                      onChange={() => handlePlatformToggle('twitter')}
                    />
                  </label>
                  <label className="flex flex-col items-center space-y-2 cursor-pointer">
                    <i className="fa-brands fa-youtube text-3xl text-[#FF0000]"></i>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded text-brand-blue focus:ring-brand-blue"
                      checked={selectedPlatforms.includes('youtube')}
                      onChange={() => handlePlatformToggle('youtube')}
                    />
                  </label>
                </div>
              </div>

              <button 
                onClick={handleGenerateContent}
                disabled={isGenerating || selectedPlatforms.length === 0}
                className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Generate Ad Content</span>
                  </>
                )}
              </button>

              <div className="space-y-4">
                {selectedPlatforms.length === 0 && generatedContent.length === 0 && (
                  <p className="text-center text-sm text-red-500">Please select at least one platform.</p>
                )}
                {generatedContent.map(content => (
                  <div key={content.platform} className="bg-white p-4 rounded-lg shadow space-y-3">
                    <div className="flex items-center space-x-2">
                      <i className={`${platformData[content.platform].icon} ${platformData[content.platform].color} text-xl`}></i>
                      <h3 className="font-bold text-md">{platformData[content.platform].name}</h3>
                    </div>
                    <p className="text-sm text-gray-700">{content.text}</p>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleEditContent(content.platform)}
                        className="text-sm font-semibold text-brand-blue hover:underline"
                      >
                        Edit Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
            <h2 className="text-2xl font-bold text-brand-dark">
              Edit {currentEditingPlatform ? platformData[currentEditingPlatform].name : ''} Ad Content
            </h2>
            
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Image</label>
              <div 
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer"
                onClick={() => document.getElementById('image-input')?.click()}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <i className="fa-solid fa-cloud-arrow-up text-4xl"></i>
                    <p>Click to upload an image</p>
                  </div>
                )}
              </div>
              <input 
                id="image-input"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content-textarea" className="font-semibold text-gray-700">Ad Copy</label>
              <textarea 
                id="content-textarea"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Persona2;