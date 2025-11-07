export const SkeletonInput = ({ label = true }) => (
    <div className="space-y-2">
        {label && <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>}
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
);

export const SkeletonButton = () => (
    <div className="h-14 bg-gradient-to-r from-[#6F47EB]/20 to-[#6F47EB]/40 rounded-xl animate-pulse"></div>
);

export const SkeletonOtp = () => (
    <div className="flex gap-3 justify-center">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="w-14 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
    </div>
);

export const SkeletonTitle = () => (
    <div className="h-8 w-64 mx-auto bg-gray-300 rounded animate-pulse"></div>
);

export const SkeletonText = () => (
    <div className="h-4 w-80 mx-auto bg-gray-200 rounded animate-pulse"></div>
);