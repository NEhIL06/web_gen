export const Preview = () => {
  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden">
      <iframe
        src="about:blank"
        className="w-full h-full border-0"
        title="Preview"
      />
    </div>
  );
};