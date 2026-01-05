import { Home, BarChart3, Megaphone, Users, TrendingUp, Calendar, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Profile Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Competitors", url: "/competitors", icon: Users },
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-[270px] fixed left-0 top-0 h-screen bg-white dark:bg-card border-r border-border shadow-soft" collapsible="none">
      <SidebarContent className="pt-8 bg-white dark:bg-card">
        <motion.div
          className="px-6 pb-6 border-b border-border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-primary">
            Vitamin T
          </h1>
        </motion.div>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {items.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SidebarMenuItem>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/70 hover:bg-accent hover:text-foreground"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <motion.div
                          className="flex items-center gap-3 w-full"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <span>{item.title}</span>
                        </motion.div>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
