export async function getKols() {
  const res = await fetch(
    "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/kols.json",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export async function getSignals() {
  const res = await fetch(
    "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/signals.json",
    {
      cache: "no-store",
    }
  );

  return res.json();
}