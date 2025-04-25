export default function Footer() {
  return (
    <footer className="custom-footer mt-auto py-4">
      <div className="container text-center">
        <small>© {new Date().getFullYear()} <strong>EventEase</strong>. All rights reserved.</small>
      </div>
    </footer>
  );
}
