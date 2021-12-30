import fs from "fs";
import path from "path";
import process from "process";

import { type Component, RawHtml } from "static-jsx";

import page1 from "./page-1.js";
import page2 from "./page-2.js";

interface NavItem {
  title: string;
  url: string;
}

export interface Page {
  title: string;
  url: string;
  content: RawHtml;
}

const Navigation: Component<{ navItems: NavItem[]; currentUrl: string }> = ({
  navItems,
  currentUrl,
}) => (
  <nav>
    <ul>
      {navItems.map((navItem) => (
        <li>
          {currentUrl === navItem.url ? (
            navItem.title
          ) : (
            <a href={navItem.url}>{navItem.title}</a>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

const Footer: Component = () => <footer>Copyright 2021 Ian Johnson</footer>;

const Page: Component<{
  children: RawHtml | RawHtml[];
  navItems: NavItem[];
  title: string;
  url: string;
}> = ({ children, navItems, title, url }) => (
  <>
    {new RawHtml("<!DOCTYPE html>")}
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </head>
      <body>
        <Navigation currentUrl={url} navItems={navItems} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  </>
);

function writePages(outDir: string, pages: Page[]) {
  const navItems = pages.map(({ title, url }) => ({ title, url }));
  for (const { title, url, content } of pages) {
    const fullPage = (
      <Page navItems={navItems} title={title} url={url}>
        {content}
      </Page>
    );
    fs.writeFileSync(path.resolve(outDir, url), fullPage.html, {
      encoding: "utf-8",
    });
  }
}

const outDir = process.argv[2];
if (!outDir) throw new Error("No output directory given");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);
writePages(outDir, [page1, page2]);
