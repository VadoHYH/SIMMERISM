'use client'

import { motion } from "framer-motion";
import { ReactNode } from "react";

type GridItemProps = {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
};

const GridItem = ({ label, onClick, children, className }: GridItemProps) => {
  return (
    <motion.div
      className={`relative rounded-2xl p-2 hover:shadow-md hover:cursor-pointer transition-all ${className ?? "bg-[#F9F4EF]"}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-[#808172] bg-opacity-60 text-white text-32 font-medium opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
        {label}
      </div>
      {children}
    </motion.div>
  );
};

export default GridItem;
