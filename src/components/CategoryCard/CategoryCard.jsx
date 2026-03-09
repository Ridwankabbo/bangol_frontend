import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
    return (
        <Link to={`/shop?category=${category.slug}`}
            className="group flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 no-underline border border-transparent hover:border-green-200">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: category.bgColor }}>
                {category.icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-gray-800 text-sm group-hover:text-green-primary transition-colors">{category.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{category.count} items</p>
            </div>
            <span className="text-gray-300 group-hover:text-green-primary group-hover:translate-x-1 transition-all text-lg">→</span>
        </Link>
    );
}
