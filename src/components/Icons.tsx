type IconProps = { size?: number; className?: string }

export const BookIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

export const ChartIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)

export const CarIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-1m-9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
  </svg>
)

export const SettingsIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

export const ChevronDownIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

export const ChevronRightIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export const ChevronLeftIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

export const PlusIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export const EditIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

export const TrashIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

export const SearchIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export const LogoutIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export const UserIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export const ArrowLeftIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

export const BirdIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 572.076 572.076" fill="currentColor" className={className}>
    <path d="M551.996,397.247c-2.596-5.145-7.344-7.013-12.486-8.2c-9.281-2.146-18.633-3.994-28.221-3.354c-4.814,0.323-9.588,1.281-14.377,1.946c-0.572,0.078-1.143,0.127-2.262,0.253c1.053-1.705,1.82-3.011,2.641-4.283c4.426-6.851,6.295-14.492,7.275-22.485c2.766-22.644,0.312-44.979-3.682-67.246c-2.848-15.868-4.932-31.898-8.494-47.598c-3.607-15.888-8.246-31.575-13.088-47.145c-6.193-19.918-12.416-39.874-19.812-59.364c-5.994-15.79-13.498-31.029-20.779-46.296c-5.863-12.289-12.318-24.3-18.654-36.357c-4.896-9.314-10.021-18.511-15.047-27.756c-0.344-0.632-0.746-1.228-1.123-1.844c-0.354-0.061-0.705-0.122-1.061-0.188c-1.93,5.614-4.148,11.151-5.736,16.858c-5.83,20.996-4.807,42.085-0.881,63.289c5.209,28.136,10.154,56.32,14.99,84.521c3.439,20.065,6.771,40.123,12.525,59.719c3.484,11.877,3.178,23.75-1.367,35.577c-4.676,12.172-9.057,24.447-16.801,35.084c-2.342,3.215-5.545,5.794-8.295,8.72c-6.301,6.695-12.713,13.288-18.797,20.176c-5.182,5.862-10.074,11.995-14.879,18.176c-1.73,2.224-3.529,3.272-6.316,2.808c-8.961-1.498-18.006-2.579-26.879-4.468c-11.918-2.538-23.881-5.108-35.518-8.67c-30.399-9.303-60.432-18.271-90.542-28.467c-9.09-3.076-17.324-8.694-25.953-13.138c-0.906-0.465-1.836-0.877-3.19-1.521c-0.73,4.904,1.559,8.486,3.823,11.922c117.256,43.117,155.836,70.486-33.909,92.963c-11.652,1.379-10.2,7.115-11.885,8.886c2.154-0.216,4.316-0.338,6.455-0.66c15.728-2.379,31.399-5.227,47.185-7.083c16.609-1.954,33.325-3.003,50.004-4.387c10.074-0.836,20.216-2.603,30.225-2.072c12.729,0.678,25.366,3.187,38.017,5.071c4.492,0.669,8.912,1.82,13.363,2.758c3.283,0.694,4.467,2.416,3.383,5.554c-4.252,12.289-9.947,23.941-17.887,34.194c-2.555,3.301-7.268,5.557-11.438,6.858c-13.002,4.063-26.124,7.854-39.375,11.008c-31.367,7.458-62.759,14.835-94.285,21.575c-27.87,5.961-55.941,10.999-83.913,16.487c-10.616,2.085-21.359,1.763-32.089,2.117c-11.55,0.384-23.072,1.587-34.61,2.387c-2.624,0.18-5.259,0.167-7.887,0.241c-0.123,0.371-0.245,0.742-0.363,1.113c4.451,2.216,8.776,4.762,13.382,6.59c13.941,5.54,28.605,8.106,43.444,9.563c38.638,3.794,77.39,4.161,116.166,3.247c31.424-0.742,62.775-2.668,93.881-7.368c21.346-3.228,42.574-7.259,63.941-10.318c19.641-2.812,39.287-5.431,58.643-9.935c15.381-3.578,28.914-10.898,41.852-19.584c3.514-2.358,7.021-4.721,10.449-7.201c4.35-3.15,7.344-7.259,8.145-12.693c0.273-1.853,1.092-2.615,3.018-2.66c4.746-0.114,9.482-0.485,14.232-0.628c1.322-0.041,2.533-0.147,3.582-0.535c34.059-3.255,66.242-21.771,83.877-50.935c3.516-3.949,8.375-6.075,12.668-8.976c1.578-1.069,3.02-2.346,4.797-3.745c-3.725-3.546-7.441-6.198-11.904-7.165C556.602,401.813,553.68,400.588,551.996,397.247z"/>
  </svg>
)

export const CheckIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export const XIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export const MenuIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
