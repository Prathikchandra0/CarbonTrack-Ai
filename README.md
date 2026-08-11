# CarbonTrack AI

CarbonTrack AI is a Vite + React sustainability dashboard for analyzing environmental records, tracking carbon and resource metrics, and exploring reduction opportunities across water, waste, energy, and materials.

The app ships with demo data by default and supports uploading CSV or Excel files to analyze custom environmental records in the browser.

## Features

- Carbon footprint dashboard with emissions summary, trend charts, predictions, and recommendations
- File upload for CSV, XLSX, and XLS input, with basic validation and processing feedback
- Water, waste, waste-to-energy, renewable energy, and sustainable materials views
- AI monitoring, environmental GIS, education, SDG dashboard, and requirements pages
- Responsive layout with a desktop sidebar and mobile drawer navigation
- Demo data reset when custom data has been loaded

## Tech Stack

- Vite
- React 18
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Recharts
- Leaflet

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm, pnpm, or bun

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

### Run linting

```sh
npm run lint
```

## Usage

1. Open the dashboard at `/` to view the default sustainability summary.
2. Use the Upload Data Log button to import a CSV or Excel file.
3. Review emissions, energy, water, waste, and prediction panels after upload.
4. Navigate through the sidebar to explore the focused sustainability modules.
5. Use Reset to Demo Data to restore the bundled sample dataset.

## Data Format

The uploader accepts CSV, XLSX, and XLS files up to 10 MB. The dashboard expects environmental records with resource usage metrics that can be parsed into the app’s internal environmental data model.

## Project Structure

- `src/App.tsx` wires routing, providers, and global UI shells
- `src/components/Dashboard.tsx` renders the main analytics dashboard
- `src/components/FileUpload.tsx` handles file selection and validation
- `src/context/EnvironmentalContext.tsx` stores the active dataset and demo reset state
- `src/lib/` contains parsing and sustainability calculation helpers
- `src/pages/` contains the routed sustainability modules

## Notes

- The repository currently does not contain any backend secrets or environment files.
- If you add API keys or service credentials later, store them in GitHub Secrets or a local `.env.local` file and keep them out of version control.

## License

No license file is currently included in the repository.
