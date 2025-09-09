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

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import BugReportIcon from '@mui/icons-material/BugReport';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import TourIcon from '@mui/icons-material/Tour';
import LockIcon from '@mui/icons-material/Lock';
import ApiIcon from '@mui/icons-material/Api';
import RecommendIcon from '@mui/icons-material/Recommend';
import TuneIcon from '@mui/icons-material/Tune';

const drawerWidth = 290;

/**
 * Main application header with navigation items
 * @return {JSX.Element} The AppHeader component
 */
const AppHeader = ({ version, onNavigate, analysisResult }) => {
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  // Navigation items
  const navItems = [
    { name: 'Home', icon: <HomeIcon /> },
    { name: 'Source', icon: <CodeIcon /> },
    { name: 'Issues', icon: <BugReportIcon /> },
    { name: 'Tour', icon: <TourIcon /> },
    { name: 'Help', icon: <HelpIcon /> },
    { name: 'About', icon: <InfoIcon /> },
  ];
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const hasAnalysisResults =
    analysisResult && Object.keys(analysisResult).length > 0;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setTimeout(() => {
        try {
          const headerOffset = 120;
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - headerOffset;

          const minScrollPosition = window.pageYOffset > 0 ? 120 : 0;
          const scrollPosition = Math.max(middle, minScrollPosition);

          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          });

          element.setAttribute('tabindex', '-1');
          element.focus({ preventScroll: true });

          const url = new URL(window.location);
          url.hash = sectionId;
          window.history.pushState({}, '', url);
        } catch (e) {
          console.error('Error scrolling to section:', e);
        }
      }, 150);
    }
  };

  const getIconForText = (text) => {
    if (text.startsWith('Required Programmatic')) {
      return <ApiIcon color="warning" />;
    } else if (text.startsWith('Required')) {
      return <LockIcon color="error" />;
    } else if (text.startsWith('Recommended')) {
      return <RecommendIcon color="primary" />;
    } else {
      return <TuneIcon color="action" />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
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
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: open ? 'block' : 'none',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Button
            onClick={(event) => {
              onNavigate(event, 'Home');
              handleDrawerClose();
            }}
            sx={{
              marginRight: 'auto',
              textTransform: 'none',
              color: 'inherit',
              fontSize: '1rem',
              padding: '8px 16px',
              minHeight: '48px',
              justifyContent: 'flex-start',
            }}
            startIcon={<HomeIcon sx={{ fontSize: '1.25rem' }} />}
          >
            Home
          </Button>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            'VAST URL Score Result',
            'Required Parameters',
            'Required Programmatic Parameters',
            'Recommended Programmatic Parameters',
            'Other Parameters',
          ].map((text) => {
            const sectionId = text.toLowerCase().replace(/\s+/g, '-');
            const hasSectionData = hasAnalysisResults;

            return (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  disabled={!hasSectionData}
                  onClick={() => {
                    if (hasSectionData) {
                      scrollToSection(sectionId);
                    }
                  }}
                  sx={{
                    opacity: hasSectionData ? 1 : 0.5,
                    cursor: hasSectionData ? 'pointer' : 'default',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    {getIconForText(text)}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          {['VAST Response'].map((text, index) => {
            const hasVastResponse = hasAnalysisResults;

            return (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  disabled={!hasVastResponse}
                  onClick={() => {
                    if (hasVastResponse) {
                      scrollToSection('vast-response');
                    }
                  }}
                  sx={{
                    opacity: hasVastResponse ? 1 : 0.5,
                    cursor: hasVastResponse ? 'pointer' : 'default',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => {
                onNavigate(event, 'Issues');
                handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ minWidth: '36px' }}>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Issues" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => {
                onNavigate(event, 'Help');
                handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ minWidth: '36px' }}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

AppHeader.propTypes = {
  version: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  analysisResult: PropTypes.shape({
    requiredParameters: PropTypes.array,
    programmaticRequiredParameters: PropTypes.array,
    programmaticRecommendedParameters: PropTypes.array,
    otherParameters: PropTypes.array,
    vastResponse: PropTypes.any,
  }),
};

AppHeader.defaultProps = {
  analysisResult: null,
};

export default AppHeader;
