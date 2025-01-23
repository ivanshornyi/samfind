"use client";

const differents = [
  "Innovation-driven approach",
  "Privacy-first philosophy",
  "Continuous advancement",
  "Community-powered evolution",
];

export const Different = () => {
  return (
    <div className="flex flex-col sm:flex-row mb-[60px] sm:mb-[680px] justify-evenly align-center">
      <h2 className="mt-auto mb-auto font-semibold text-2xl sm:text-[40px] leading-[32px] sm:leading-[54px] w-full max-w-[300px]">
        What Makes Us Different
      </h2>
      <div className="mt-[30px] sm:mt-0">
        {differents.map((different) => (
          <p
            key={different}
            className="w-full sm:w-[688px] mb-[10px] uppercase bg-card rounded-[20px] p-8 px-6 text-link-hover"
          >
            {different}
          </p>
        ))}
      </div>
    </div>
  );
};
