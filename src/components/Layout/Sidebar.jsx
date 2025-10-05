import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/workouts', label: 'Workouts' },
    { to: '/nutrition', label: 'Nutrition' },
    { to: '/metrics', label: 'Health Metrics' },
    { to: '/progress', label: 'Progress' },
    { to: '/profile', label: 'Profile' }
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">NutriFit</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  lock px-4 py-2 rounded hover:bg-gray-700 $\{
                    isActive ? 'bg-gray-700' : ''
                  }
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
