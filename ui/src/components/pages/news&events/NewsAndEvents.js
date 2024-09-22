import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import * as Bootstrap from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaPen, FaTrash } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

export default function NewsAndEvents() {
	const [news, setNews] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
	const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
	const [formData, setFormData] = useState({
		_id: "",
		picture: "",
		title: "",
		author: "",
		when: "",
		where: "",
		article: "",
	});
	const [loading, setLoading] = useState(false);
	const [newsIdToDelete, setNewIdToDelete] = useState(null); // State to track the appointment ID to delete
	const [image, setImage] = useState("");

	useEffect(() => {
		const fetchNews = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get("http://localhost:5001/api/news", {
					headers,
				});
				console.log("Fetched news:", res.data); // Log the fetched data
				setNews(res.data);
			} catch (error) {
				console.error("Error fetching news:", error);
			}
		};
		fetchNews();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);
		try {
			if (modalType === "Add") {
				const res = await Axios.post(
					"http://localhost:5001/api/news",
					formData,
					{ headers }
				);
				setLoading(false);
				setNews([...news, res.data]);
				toast.success("News added successfully");
			} else {
				const { password, ...updateData } = formData; // Exclude password from update data
				const res = await Axios.put(
					`http://localhost:5001/api/news/${formData._id}`,
					updateData,
					{ headers }
				);
				setLoading(false);
				setNews(
					news.map((newss) => (newss._id === formData._id ? res.data : newss))
				);
				toast.success("News updated successfully");
			}
			handleCloseModal();
		} catch (error) {
			console.error("Error saving news:", error);
			toast.error("Error saving news");
		}
	};

	const handleShowModal = (type, news = {}) => {
		setModalType(type);
		setFormData({
			_id: news._id || "",
			picture: news.picture || "",
			title: news.title || "",
			author: news.author || "",
			when: news.when || "",
			where: news.where || "",
			article: news.article || "",
		});
		setImage(news.picture);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleShowDeleteModal = (id) => {
		setNewIdToDelete(id); // Set the user ID to delete
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
	};

	const handleConfirmDelete = async () => {
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			await Axios.delete(`http://localhost:5001/api/news/${newsIdToDelete}`, {
				headers,
			});
			setLoading(false);
			setNews(news.filter((newss) => newss._id !== newsIdToDelete));
			toast.success("News deleted successfully");
		} catch (error) {
			setLoading(false);
			console.error("Error deleting News:", error);
			toast.error("Error deleting News");
		} finally {
			handleCloseDeleteModal(); // Close the confirmation modal after deletion
		}
	};

	function coinvertToBase64(e) {
		console.log("$$e", e);
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			console.log("$$res", reader.result);
			setImage(reader.result);
			setFormData({ ...formData, picture: reader.result });
		};
		reader.onerror = (error) => {
			console.log("$$err", error);
		};
	}

	function coinvertToBase64(e) {
		console.log("$$e", e);
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			console.log("$$res", reader.result);
			setImage(reader.result);
			setFormData({ ...formData, picture: reader.result });
		};
		reader.onerror = (error) => {
			console.log("$$err", error);
		};
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		}).format(date);
	};

	return (
		<div className="container mt-4 mx-4 p-4">
			<h4 className="d-inline-block">News & Events</h4>
			<Bootstrap.Badge className="ms-2 rounded-pill" bg="primary">
				{news.length}
			</Bootstrap.Badge>
			<div className="action-button">
				<Bootstrap.Button
					variant="primary"
					onClick={() => handleShowModal("Add")}
				>
					Add News
				</Bootstrap.Button>
			</div>
			<Bootstrap.Table
				responsive
				className="table table-striped table-hover mt-3"
			>
				<thead className="thead-dark">
					<tr>
						<th>ID</th>
						<th>Picture</th>
						<th>Title</th>
						<th>Author</th>
						<th>When</th>
						<th>Where</th>
						<th>Article</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{news.map((newss, index) => (
						<tr key={newss._id}>
							<td>{index + 1}</td>
							<td>
								<img src={newss.picture} width={100} height={100}></img>
							</td>
							<td>{newss.title}</td>
							<td>{newss.author}</td>
							<td>{formatDate(newss.when)}</td>
							<td>{newss.where}</td>
							<td>{newss.article}</td>
							<td>
								<FaPen
									style={{
										cursor: "pointer",
										marginRight: "10px",
										color: "blue",
									}}
									onClick={() => handleShowModal("Edit", newss)}
								/>
								<FaTrash
									style={{ cursor: "pointer", color: "red", paddingLeft: 2 }}
									onClick={() => handleShowDeleteModal(newss._id)} // Open delete confirmation modal
								/>
							</td>
						</tr>
					))}
				</tbody>
			</Bootstrap.Table>

			{/* User Modal */}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>{modalType} News and Events</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>Image</Form.Label>
							<Form.Control
								accept="image/png, image/gif, image/jpeg,image/jpg"
								type="file"
								onChange={coinvertToBase64}
								//value={formData.picture}
								// onChange={(e) =>
								//   setFormData({ ...formData, date: e.target.value })
								// }
								required
							/>
							{image == "" || image == null ? (
								""
							) : (
								<img width={100} height={100} src={image} />
							)}
						</Form.Group>
						<Form.Group>
							<Form.Label>Title</Form.Label>
							<Form.Control
								type="text"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Author</Form.Label>
							<Form.Control
								type="text"
								value={formData.author}
								onChange={(e) =>
									setFormData({ ...formData, author: e.target.value })
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>When</Form.Label>
							<Form.Control
								type="date"
								value={formData.when}
								onChange={(e) =>
									setFormData({ ...formData, when: e.target.value })
								}
								required
							/>
						</Form.Group>{" "}
						<Form.Group>
							<Form.Label>Where</Form.Label>
							<Form.Control
								type="text"
								value={formData.where}
								onChange={(e) =>
									setFormData({ ...formData, where: e.target.value })
								}
								required
							/>
						</Form.Group>{" "}
						<Form.Group>
							<Form.Label>Article</Form.Label>
							<Form.Control
								type="text"
								value={formData.article}
								onChange={(e) =>
									setFormData({ ...formData, article: e.target.value })
								}
								required
							/>
						</Form.Group>
						<div className="action-button">
							<Button variant="primary" type="submit" className="mt-3">
								{loading ? (
									<Bootstrap.Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										style={{ marginRight: "10px" }}
									/>
								) : (
									""
								)}
								{modalType === "Add" ? "Add Appointment" : "Update Appointment"}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Deletion</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to delete this user?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseDeleteModal}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleConfirmDelete}>
						{loading ? (
							<Bootstrap.Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								style={{ marginRight: "10px" }}
							/>
						) : (
							""
						)}
						Delete
					</Button>
				</Modal.Footer>
			</Modal>

			<ToastContainer position="bottom-right" />
		</div>
	);
}
