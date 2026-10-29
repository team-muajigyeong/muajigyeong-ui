type Styles = Record<string, string>;

type ClassValue = string | Record<string, unknown> | false | null | undefined;

export function createCX(styles: Styles) {
  const cx = (...values: ClassValue[]) => {
    const names: string[] = [];

    for (const value of values) {
      if (!value) continue;

      if (typeof value === "string") {
        names.push(styles[value] ?? value);
        continue;
      }

      for (const [name, enabled] of Object.entries(value)) {
        if (enabled) names.push(styles[name] ?? name);
      }
    }

    return names.join(" ");
  };

  const c = (strings: TemplateStringsArray) => {
    const names = strings[0].trim().split(/\s+/).filter(Boolean);
    return cx(...names);
  };

  return { c, cx };
}
