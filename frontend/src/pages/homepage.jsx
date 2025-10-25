// import React from "react";

// const HomePage = () => {
//     return (
//         <div className="bg-[#dbc1aa] w-screen h-screen absolute left-0 top-0">
//             {/* Left Background SVG */}
//         <img className="h-full w-screen opacity-52" src="textures.png" alt="" />
//             <div className="absolute top-40 left-32 z-30">
//                 <h1 className="w-[700px] text-left font-abril text-[90px] text-black font-medium leading-[100px] tracking-wider">
//                     Where your colors come to life
//                 </h1>
//                 <p className="w-[700px] text-left font-poppins tracking-wider mt-8 leading-tight text-5xl text-black">
//                     Experience fashion that harmonizes with your essence!
//                 </p>
//             </div>


//             {/* Right Fixed Image */}
//             <div className="lg:block fixed top-0 right-0 w-[850px] h-full z-10 overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.5),0_5px_10px_rgba(0,0,0,0.3)] image-clip-left-curve-ellipse">
//                 <img
//                     className="w-full h-full object-cover filter brightness-75 contrast-110"
//                     src="/final.png"
//                     alt="Colorful background"
//                 />
//                 <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none"></div>
//             </div>
//         </div>
//     );
// };

// export default HomePage;
import React from "react";
import { motion } from "framer-motion";

const HomePage = () => {
    // Animation variants for text
    const textVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 1.2, delay, ease: "easeOut" },
        }),
    };

    // Animation for image
    const imageVariant = {
        hidden: { opacity: 0, scale: 1.05 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1.5, ease: "easeOut" },
        },
    };

    return (
        <div className="bg-[#FAE8D4] w-screen h-screen absolute left-0 top-0 overflow-x-hidden">
            {/* Text Content with animation */}
            <motion.div
                className="absolute top-52 left-5 sm:top-20 sm:left-10 md:top-32 md:left-20 lg:top-40 lg:left-40 z-30 max-w-[90vw]"
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    variants={textVariant}
                    custom={0.2}
                    className="w-full leading-[60px] text-left font-abril text-[50px] lg:w-[700px] md:w-[600px] sm:[500px] sm:text-[50px] md:text-[70px] lg:text-[90px] text-black font-medium lg:leading-[100px] tracking-wider"
                >
                    Where your colors come to life
                </motion.h1>

                <motion.p
                    variants={textVariant}
                    custom={0.6}
                    className="w-full text-left font-poppins tracking-wider mt-4 text-2xl lg:w-[700px] md:w-[600px] sm:[500px] sm:mt-6 md:mt-8 lg:mt-10 leading-relaxed text-lg sm:text-xl md:text-2xl lg:text-5xl text-black"
                >
                    Experience fashion that harmonizes with your essence
                </motion.p>
            </motion.div>

            {/* Right Fixed Image with motion */}
            <motion.div
                className="absolute top-10 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-[850px] h-full z-10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.5)]"
                variants={imageVariant}
                initial="hidden"
                animate="visible"
            >
                <img
                    className="w-full h-full object-cover filter brightness-75 contrast-110"
                    src="/final.png"
                    alt="Colorful background"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none"></div>
            </motion.div>
        </div>
    );
};

export default HomePage;
