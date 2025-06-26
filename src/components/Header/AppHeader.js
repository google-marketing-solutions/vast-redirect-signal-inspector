/**
 * @license Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview App header component with navigation
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import BugReportIcon from '@mui/icons-material/BugReport';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import TourIcon from '@mui/icons-material/Tour';

/**
 * Main application header with navigation items
 * @return {JSX.Element} The AppHeader component
 */
const AppHeader = ({ version, onNavigate }) => {
  // Navigation items
  const navItems = [
    { name: 'Home', icon: <HomeIcon /> },
    { name: 'Source', icon: <CodeIcon /> },
    { name: 'Issues', icon: <BugReportIcon /> },
    { name: 'Tour', icon: <TourIcon /> },
    { name: 'Help', icon: <HelpIcon /> },
    { name: 'About', icon: <InfoIcon /> },
  ];

  return (
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => {}}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: 'none', sm: 'block', verticalAlign: 'middle' },
          }}
        >
          <img
            src="https://raw.githubusercontent.com/google-marketing-solutions/vast-redirect-signal-inspector/main/assets/png/logo_home.png"
            alt="Logo"
            style={{
              height: '0.7em',
              width: 'auto',
              verticalAlign: 'middle',
              margin: '0 10px 5px 0',
            }}
          />
          VAST Signal Inspector v{version}
          <span
            style={{
              backgroundColor: '#e0e0e0',
              color: '#333',
              padding: '2px 5px',
              borderRadius: '3px',
              fontSize: '0.7em',
              marginLeft: '5px',
            }}
          >
            Beta
          </span>
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              sx={{
                color: '#fff',
                gap: 1,
              }}
              onClick={(event) => onNavigate(event, item.name)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

AppHeader.propTypes = {
  version: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default AppHeader;
