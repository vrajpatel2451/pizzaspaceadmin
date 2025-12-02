import {
  Rocket,
  Sparkles,
  Clock,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
}

const ComingSoon = ({
  title = "Coming Soon",
  subtitle = "We're working on something amazing",
  description = "This feature is currently under development. Stay tuned for updates!",
  icon: Icon = Rocket,
}: ComingSoonProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="relative max-w-2xl text-center">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

        {/* Floating icons */}
        <div className="absolute -top-8 left-1/4 animate-bounce">
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </div>
        <div
          className="absolute -top-4 right-1/4 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        >
          <Zap className="h-5 w-5 text-blue-400" />
        </div>
        <div
          className="absolute top-1/3 -right-8 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
        </div>

        {/* Main content card */}
        <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-12 shadow-xl backdrop-blur-sm">
          {/* Icon container with animated ring */}
          <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
            {/* Animated rings */}
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div
              className="absolute inset-2 animate-pulse rounded-full bg-primary/10"
              style={{ animationDelay: "0.5s" }}
            />

            {/* Icon background */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Icon className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-4xl font-bold text-transparent">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mb-4 text-xl font-medium text-slate-600">{subtitle}</p>

          {/* Description */}
          <p className="mb-8 text-slate-500">{description}</p>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Under Development
            </span>
          </div>

          {/* Progress indicator */}
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm text-slate-500">
              <span>Progress</span>
              <span>Building...</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full animate-pulse rounded-full bg-gradient-to-r from-primary to-primary/60"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        </div>

        {/* Bottom decorative dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-primary/70"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-primary/40"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
