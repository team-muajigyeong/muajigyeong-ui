import { useSyncExternalStore, type PropsWithChildren } from "react";
import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { themes } from "storybook/theming";

const query = "(prefers-color-scheme: dark)";

/** Follow operating-system theme changes while the documentation stays open. */
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Keep Docs content and its controls in the system theme independently of the manager UI. */
export function SystemDocsContainer(props: PropsWithChildren<DocsContainerProps>) {
  const dark = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  return <DocsContainer {...props} theme={dark ? themes.dark : themes.light} />;
}
