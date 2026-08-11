import { Dashboard } from '@/components/Dashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CarbonTrack - AI-Powered Carbon Footprint Monitoring & Reduction System</title>
        <meta name="description" content="Monitor, analyze, and reduce your carbon footprint with AI-powered analytics and GIS visualization. Upload your data to get personalized sustainability recommendations." />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default Index;
