import { ProjectIconArrow } from "./ProjectIconArrow";



export function ProjectsSectionFooter() {
  return (
    <div className="mt-11 flex justify-end items-center">
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-['Bebas_Neue'] text-[0.78rem] tracking-[0.18em] text-[var(--yale-blue)] no-underline flex items-center gap-1.5 py-2 px-[1.1rem] border-[1.5px] border-[var(--yale-blue)] rounded-[2px] transition-all duration-[250ms] ease-out hover:bg-[var(--yale-blue)] hover:text-[var(--frozen-water)]"
      >
        ALL REPOS <ProjectIconArrow color="var(--yale-blue)" />
      </a>
    </div>
  );
}
