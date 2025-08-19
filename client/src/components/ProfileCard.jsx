const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          {user.github_username && (
            <a
              href={`https://github.com/${user.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @{user.github_username}
            </a>
          )}
        </div>
      </div>

      {user.bio && (
        <p className="mt-4 text-gray-600">{user.bio}</p>
      )}

      {user.skills && user.skills.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCard