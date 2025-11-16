"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreateForm } from "@/constants";
import { motion } from "framer-motion";

const directions = [
  { x: -40, y: 0 },
  { x: 40, y: 0 },
  { x: 0, y: 40 },
  { x: 0, y: -40 },
];

const TeacherGroup = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-16 space-y-14">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100 tracking-tight"
      >
        {t("createForms.title")}
      </motion.h1>

      {/* Grid */}
      <div className="w-[70%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CreateForm.map((item, index) => {
          const Icon = item.icon;
          const dir = directions[index % directions.length];

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: dir.x, y: dir.y, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
            >
              <Link
                to={item.href}
                className="group rounded-xl bg-white dark:bg-neutral-900 
                border border-gray-200 dark:border-neutral-700 
                p-6 flex flex-col items-center justify-center gap-3
                hover:shadow-lg transition-all duration-300"
              >

                {/* Icon Box */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
              
                >
                  <Icon
                    size={28}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Name */}
                <span
                  className="text-lg font-medium transition-colors duration-300"
              
                >
                  {t(item.name)}
                </span>

              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherGroup;
