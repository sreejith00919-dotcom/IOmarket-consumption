import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PanelProps {
  title: string;
  headerColor: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const Panel: React.FC<PanelProps> = ({ title, headerColor, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="panel-card" id={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div 
        className="panel-header" 
        style={{ backgroundColor: headerColor }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="mr-2">{isExpanded ? '▼' : '▲'}</span>
        {title}
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="panel-body">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
