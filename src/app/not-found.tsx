import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <>
      <div className="pointer-events-none relative -mt-[56px] flex h-[calc(100%-70px)] flex-col items-center justify-center gap-8 overflow-hidden [&>*]:pointer-events-auto">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 font-mono text-4xl font-bold leading-tight opacity-60 md:text-9xl">
            404
          </h1>
          <p className="px-6 text-center text-base md:px-0 md:text-xl">
            Looks Like You Took a Wrong Turn at the Interface.{" "}
            <br className="hidden md:inline" />
            Let's Get You Back on Track
          </p>
        </div>
        <div>
          <a href="/">
            <Button variant="default" size="lg">
              Home
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
