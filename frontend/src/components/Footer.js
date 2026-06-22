export default function Footer() {
  return (
    <footer className="w-full mt-stack-lg bg-surface-container-lowest border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-lg w-full max-w-container-max mx-auto">
        <div className="md:col-span-1 space-y-stack-sm">
          <span className="font-display-lg text-headline-md text-primary font-bold uppercase">CinePass</span>
          <p className="text-on-surface-variant font-label-md mt-4">
            © 2026 CinePass. Experience the Red Carpet Digital.
          </p>
          <div className="flex gap-4 pt-2">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
              face_nod
            </span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
              public
            </span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
              movie
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <h5 className="text-on-surface font-bold uppercase text-[12px] tracking-widest">Navigation</h5>
          <ul className="space-y-2">
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                Cinemas
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                Offers
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                Events
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="text-on-surface font-bold uppercase text-[12px] tracking-widest">Support</h5>
          <ul className="space-y-2">
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary text-label-md transition-colors" href="#">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="text-on-surface font-bold uppercase text-[12px] tracking-widest">Download App</h5>
          <p className="text-on-surface-variant text-label-md">Book tickets on the go with our mobile app.</p>
          <div className="flex flex-col gap-2">
            <div className="bg-surface-container-high border border-white/10 p-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">phone_iphone</span>
              <div className="text-[10px] leading-tight">
                <span className="block">Get it on</span>
                <span className="font-bold text-xs">App Store</span>
              </div>
            </div>
            <div className="bg-surface-container-high border border-white/10 p-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">android</span>
              <div className="text-[10px] leading-tight">
                <span className="block">Get it on</span>
                <span className="font-bold text-xs">Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
