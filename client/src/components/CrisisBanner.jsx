function CrisisBanner({ crisis }) {
  if (!crisis?.flagged) return null;

  return (
    <div className="banner" role="alert">
      {crisis.helplineMessage || 'You are not alone. Please seek immediate support.'}
    </div>
  );
}

export default CrisisBanner;
