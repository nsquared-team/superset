import { Global, css } from '@emotion/react';

export default function GlobalStyles() {
  return (
    <Global
      styles={css`
        /* 
        These are the classes that are used in the dashboard.
        .dashboard        → App background wrapper
        .ant-tabs-nav     → Tabs container text color
        .ant-tabs-tab     → Tab items (hover, active states)
        .ant-tabs-ink-bar → Active tab underline
        .dashboard-component → Card-style components
        .superset-19ooo9m      → Grid layout (header, main, sidebar)
        .superset-c321xa        → Header (full width, sticky)
        .superset-t22g9u       → Main content area
        .superset-1yp7bm       → Sidebar (main, collapsed state)
        .superset-bfu8z5      → Sidebar (expanded state)
        */
        :root {
        --background-dashboard: #F7F3EC;
        --background-tabs: #400406;
        --text-light: #FFFFFF;
        --active-tab: #73060A;
        --active-underline: #FFCC00;
        --hover-tab: #B31217;
        --link: #15526e;
        --link-hover: #207DA7;
        --blink-red: #801219;
        --blink-yellow: #FFCC00;
        }
        
        html, body {
        font-family: Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
                    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
        background-color: var(--background-dashboard) !important;
        }
        .dashboard-content {
        background-color: var(--background-dashboard) !important;
        }
        
        .dashboard { background-color: var(--background-dashboard) !important; }
        
        .ant-tabs-nav { color: var(--link) !important; }
        .ant-tabs-tab:hover { color: var(--link-hover) !important; }
        .ant-tabs-tab-active { color: var(--link) !important; border-radius: 8px; }
        .ant-tabs-ink-bar { background-color: var(--active-underline) !important; }
        .anchor-link-container { display: none !important; }
        
        .superset-t22g9u .dashboard-component { border-radius: 10px !important; }
        
        .superset-19ooo9m {
        position: relative !important;
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        grid-template-rows: auto 1fr !important;
        grid-template-areas:
            "header header"
            "main   side";
        flex: 1 1 0% !important;
        }
        
        .superset-c321xa  {
        grid-area: header !important;
        grid-column: 1 / -1 !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 100 !important;
        width: 100% !important;
        max-width: none !important;
        background-color: var(--background-dashboard) !important;
        }
        
        .superset-t22g9u { grid-area: main !important; }
        .css-6d0iqe { grid-area: main !important; }

        .superset-t22g9u > div:nth-of-type(1) > div:nth-of-type(1) {
        justify-content: space-between !important;
        }
        
        .superset-1yp7bm {
        grid-area: side !important;
        background-color: var(--background-dashboard) !important;
        }

        .superset-bfu8z5 {
        grid-area: side !important;
        }
        
        .superset-1yp7bm > div:nth-of-type(1) {
        background-color: var(--blink-red) !important;
        border-radius: 10px 0 0 10px !important;
        }

        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(1) {
        margin-top: 10px !important;
        }
        
        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(1) span[aria-label="vertical-align"] svg {
        color: var(--blink-yellow) !important;
        transform: rotate(180deg) !important;
        }
        
        .superset-bfu8z5 > div:nth-of-type(1) > div:nth-of-type(1) span[aria-label="vertical-align"] svg {
        transform: rotate(180deg) !important;
        }
        
        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(1) span[aria-label="filter"] svg {
        color: var(--background-dashboard) !important;
        }

        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(2) span[aria-label="setting"] svg {
        color: var(--background-dashboard) !important;
        }

        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(2) span[aria-label="vertical-align"] svg {
        color: var(--background-dashboard) !important;
        }
        
        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(1) [role="button"],
        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(1) .anticon,
        .superset-1yp7bm > div:nth-of-type(1) > div:nth-of-type(1) svg {
        position: static !important;
        top: auto !important;
        }
        
        .superset-c321xa  > div:nth-of-type(1) { margin-left: 0 !important; }
        
        /* Default margin when no sidebar is present */
        .superset-t22g9u .grid-container { 
          margin: 24px 32px 24px 32px !important; 
        }
        
        /* Override when sidebar is present */
        .superset-19ooo9m:has(.superset-1yp7bm) .superset-t22g9u .grid-container,
        .superset-19ooo9m:has(.superset-bfu8z5) .superset-t22g9u .grid-container {
          margin: 24px 10px 24px 32px !important;
        }

        .superset-button.superset-button-secondary.superset-1a84gsj {
          background-color: #f5f5f5 !important;
          color: #000000A6 !important;
          transition: background 0.2s !important;
        }
        .superset-button.superset-button-secondary.superset-1a84gsj sup{
          background-color: #000000A6 !important;
        }
        .superset-button.superset-button-secondary.superset-1a84gsj:hover {
          background-color: #f4f4f4 !important;
        }
      `}
    />
  );
}
