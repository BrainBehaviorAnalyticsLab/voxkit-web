import type { Metadata } from "next";
import { Navbar } from "../../layout";

export const metadata: Metadata = {
  title: "VoxKit API Documentation",
  description:
    "Generated API reference for the VoxKit Python package: storage, analyzers, engines, and configuration.",
};

/**
 * The pdoc bundle in `public/docs` is already a complete documentation site,
 * with a sidebar pane and a content pane that scroll independently. This route
 * hands it the whole viewport below the navbar instead of insetting it in a
 * card, so those two are the only scrollbars on the page.
 *
 * `Footer` is deliberately absent. As a sibling of a viewport-height region it
 * put a third, outer scrollbar on the window, and scrolling it slid the entire
 * docs pane out of view.
 */
export default function DocsPage() {
  return (
    <div data-full-viewport className="h-dvh overflow-hidden bg-slate-900">
      <Navbar view="Docs" />
      {/* Navbar is `fixed` but sets no `top`, so it renders wherever its static
          position falls. It has to stay the first child of an unpadded parent;
          the clearance for it belongs on this sibling instead. */}
      <div className="h-full pt-16">
        {/* Straight to voxkit.html. /docs/index.html is only a meta-refresh
            stub, and in a frame that hop becomes a session history entry, so
            pressing Back once just bounces the visitor into the docs again. */}
        <iframe
          src="/docs/voxkit.html"
          title="VoxKit API documentation"
          className="block h-full w-full border-none"
        />
      </div>
    </div>
  );
}
