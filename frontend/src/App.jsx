import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Role Gateways & Dedicated Views
import { RoleAuthGateway } from './components/RoleAuthGateway';
import { StaffDashboardView } from './components/StaffDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

// Customer Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SafeHandlingBanner } from './components/SafeHandlingBanner';
import { SpecialMomentsSection } from './components/SpecialMomentsSection';
import { PetsSection } from './components/PetsSection';
import { MenuSection } from './components/MenuSection';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

// Customer Modals
import { ReservationModal } from './components/ReservationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CafeRulesModal } from './components/CafeRulesModal';
import { PetDetailModal } from './components/PetDetailModal';
import { SearchModal } from './components/SearchModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { WriteReviewModal } from './components/WriteReviewModal';

function MainApp() {
  const { user, loading, isStaff, isAdmin } = useAuth();

  // Customer navigation state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'pets' | 'menu' | 'gallery' | 'about'
  const [menuInitialCategory, setMenuInitialCategory] = useState('All');

  // Customer Modals state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [preselectedPet, setPreselectedPet] = useState(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPetDetailOpen, setIsPetDetailOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // 1. Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faff] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#1e75ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-600">Loading Pet Café Experience...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Show Role-Based Authentication Gateway (Sign In / Register by Role)
  if (!user) {
    return <RoleAuthGateway />;
  }

  // 3. Authenticated as Staff: Show ONLY dedicated Staff Operations Portal
  if (user.roleName === 'Staff') {
    return <StaffDashboardView />;
  }

  // 4. Authenticated as Administrator: Show ONLY dedicated Admin Control Center
  if (user.roleName === 'Admin') {
    return <AdminDashboardView />;
  }

  // 5. Authenticated as Customer: Show full Customer Experience & Flow
  const handleOpenReservation = (pet = null) => {
    setPreselectedPet(pet);
    setIsReservationOpen(true);
  };

  const handleOpenPetDetail = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailOpen(true);
  };

  const handleSelectCategoryFromHero = (tab, filter) => {
    setActiveTab(tab);
    if (tab === 'menu' && filter) {
      setMenuInitialCategory(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faff] text-slate-800 animate-pop-in">
      
      {/* Customer Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReservation={() => handleOpenReservation(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
      />

      {/* Customer Content by Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Hero Section matching user design screenshot */}
            <HeroSection
              onBookTable={() => handleOpenReservation(null)}
              onMeetPets={() => {
                setActiveTab('pets');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Safe Handling & Rules Banner */}
            <SafeHandlingBanner onOpenRules={() => setIsRulesOpen(true)} />

            {/* Special Moments Category Grid */}
            <SpecialMomentsSection onSelectCategory={handleSelectCategoryFromHero} />

            {/* Resident Pets Showcase Preview */}
            <div className="pt-6">
              <PetsSection
                onSelectPet={handleOpenPetDetail}
                onBookWithPet={handleOpenReservation}
              />
            </div>

            {/* Customer Testimonials & Reviews */}
            <ReviewsSection onWriteReview={() => setIsReviewOpen(true)} />
          </div>
        )}

        {activeTab === 'pets' && (
          <div className="animate-pop-in">
            <PetsSection
              onSelectPet={handleOpenPetDetail}
              onBookWithPet={handleOpenReservation}
            />
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-pop-in">
            <MenuSection initialCategory={menuInitialCategory} />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-pop-in">
            <GallerySection onBookTable={() => handleOpenReservation(null)} />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-pop-in">
            <AboutSection onBookTable={() => handleOpenReservation(null)} />
            <SafeHandlingBanner onOpenRules={() => setIsRulesOpen(true)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Customer Modals and Drawers */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        preselectedPet={preselectedPet}
      />

      <CartDrawer />

      <CheckoutModal onOpenAuth={() => {}} />

      <CafeRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <PetDetailModal
        isOpen={isPetDetailOpen}
        onClose={() => setIsPetDetailOpen(false)}
        pet={selectedPet}
        onBookWithPet={handleOpenReservation}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPet={handleOpenPetDetail}
        onNavigateToMenu={(cat) => handleSelectCategoryFromHero('menu', cat)}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        onOpenReview={() => setIsReviewOpen(true)}
      />

      <WriteReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={() => {}}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
