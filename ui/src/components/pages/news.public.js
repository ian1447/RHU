import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Use useLocation to access the passed state
import "./styles.css";
import { FaRegUserCircle } from "react-icons/fa";

export default function PublicNews() {
	const location = useLocation();

	const { newsItem } = location.state || {}; // Retrieve the passed news item
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [reply, setReply] = useState({});
	const [showReply, setShowReply] = useState({});

	const toggleReply = (index) => {
		setShowReply((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}));
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		}).format(date);
	};

	const handleAddComment = () => {
		if (newComment.trim()) {
			setComments([...comments, { text: newComment, replies: [] }]);
			setNewComment("");
		}
	};

	const handleReplyChange = (index, replyText) => {
		setReply({ ...reply, [index]: replyText });
	};

	const handleAddReply = (index) => {
		if (reply[index]) {
			const updatedComments = [...comments];
			updatedComments[index].replies.push(reply[index]);
			setComments(updatedComments);
			setReply({ ...reply, [index]: "" });
		}
	};

	return (
		<div className="news-page-container">
			{newsItem ? (
				<>
					{/* Left Column: News Content */}
					<div>
						<img
							src={newsItem.picture}
							alt={newsItem.title}
							className="news-image"
						/>
						<h5 className="news-title">{newsItem.title}</h5>
						<p className="news-article">{newsItem.article}</p>
						<small className="news-date">{newsItem.when}</small>
					</div>

					{/* Right Column: Comments Section */}
					<div className="comments-section">
						<h3>Comments</h3>

						{/* List of comments */}
						<div className="comments-list">
							{comments.length > 0 ? (
								comments.map((comment, index) => (
									<div key={index} className="comment-card">
										{/* User avatar, name, and date */}
                                        <div className="comment-header">
                                            <FaRegUserCircle className="user-avatar" />
											{/* <img
												src={comment.userAvatar} 
												alt="User avatar"
												className="user-avatar"
											/> */}
											<div className="user-info">
												<p className="user-name">{comment.userName || "Hosefh Braindawn"}</p>{" "}
												{/* Username */}
												<small className="comment-date">
													{comment.date || "September 20, 2024"}
												</small>{" "}
												{/* Comment date */}
											</div>
										</div>

										{/* Comment text */}
										<p className="comment-text">{comment.text}</p>

										{/* Reply toggle */}
										<div
											style={{ cursor: "pointer", color: "gray" }}
											onClick={() => toggleReply(index)}
										>
											Reply
										</div>

										{/* Replies */}
										<div className="replies">
											{comment.replies.length > 0 &&
												comment.replies.map((replyText, replyIndex) => (
													<p key={replyIndex} className="reply-text">
														<span>Staff's Response: </span>
														{replyText}
													</p>
												))}
										</div>

										{/* Conditionally show reply textarea and button */}
										{showReply[index] && (
											<div className="reply-section">
												<textarea
													placeholder="Reply..."
													value={reply[index] || ""}
													onChange={(e) =>
														handleReplyChange(index, e.target.value)
													}
													className="reply-input"
												></textarea>
												<button
													onClick={() => handleAddReply(index)}
													className="reply-btn"
												>
													Reply
												</button>
											</div>
										)}
									</div>
								))
							) : (
								<p>No comments yet.</p>
							)}
						</div>

						{/* Input for adding a comment */}
						<div className="add-comment">
							<textarea
								placeholder="Add a comment..."
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								className="comment-input"
							></textarea>
							<button onClick={handleAddComment} className="add-comment-btn">
								Add Comment
							</button>
						</div>
					</div>
				</>
			) : (
				<p>No news selected.</p>
			)}
		</div>
	);
}
