// import useThemeStore from "@/store/useTheme";
// import React from "react";
// import "../../styles/themeToggle.css";

// const ThemeToggle: React.FC = () => {
//   const { toggleTheme, theme } = useThemeStore();

//   const handleThemeToggle = () => {
//     if (!document.startViewTransition) {
//       toggleTheme();
//     } else {
//       document.startViewTransition(() => {
//         toggleTheme();
//       });
//     }
//   };

//   return (
//     <div
//       className={`theme-toggle-container toggle-track bg-nl-200 dark:bg-nd-500 h-[24px] w-[44px] rounded-full p-0.5 ${
//         theme === "light" ? "theme-light" : "theme-dark"
//       }`}
//       onClick={handleThemeToggle}
//     >
//       <div className="svg-container">
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className="sun-svg"
//         >
//           <circle cx="12" cy="12" r="12" fill="url(#paint0_linear_sun)" />
//           <defs>
//             <linearGradient
//               id="paint0_linear_sun"
//               x1="20.5"
//               y1="3"
//               x2="4"
//               y2="22"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop stopColor="#FF9B57" />
//               <stop offset="1" stopColor="#F24D3C" />
//             </linearGradient>
//           </defs>
//         </svg>

//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className="moon-svg"
//         >
//           <path
//             d="M12 0C10.4087 1.5913 9.51472 3.74956 9.51472 6C9.51472 8.25043 10.4087 10.4087 12 12C13.5913 13.5913 15.7496 14.4853 18 14.4853C20.2504 14.4853 22.4087 13.5913 24 12C24 14.3734 23.2962 16.6934 21.9776 18.6668C20.6591 20.6402 18.7849 22.1783 16.5922 23.0866C14.3995 23.9948 11.9867 24.2324 9.65892 23.7694C7.33115 23.3064 5.19295 22.1635 3.51472 20.4853C1.83649 18.807 0.693605 16.6689 0.230582 14.3411C-0.232441 12.0133 0.00519931 9.60051 0.913451 7.4078C1.8217 5.21508 3.35977 3.34094 5.33316 2.02236C7.30655 0.703788 9.62663 0 12 0Z"
//             fill="url(#paint0_linear_moon)"
//           />
//           <defs>
//             <linearGradient
//               id="paint0_linear_moon"
//               x1="20.6667"
//               y1="3.33333"
//               x2="3.33333"
//               y2="21.3333"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop stopColor="#AD92E8" />
//               <stop offset="1" stopColor="#59B2FF" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default ThemeToggle;
