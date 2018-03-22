
const ejs = require('ejs');
const fetch = require('node-fetch');

const bcrypt = require('bcrypt');

const database = require('../config/database.js');
const db = database.db;

const mail = require('../config/mail.js');
const mainConfig = require('../config/main.js');
const popModel = require('../models/pop.js')

exports.feed = () => {
	return new Promise((resolve, reject) => {
		db.query("SELECT * FROM tags", (err, tags) => {
			if (err) {
				return reject(err);
			} else {
				db.query("SELECT firstname, name, username, email, city, age, gender, password FROM fakenames LIMIT 500", (err, toLoad) => {
					if (err) {
						return reject(err);
					} else {
						toLoad = toLoad.map((e) => {
							const tag1 = Math.floor(Math.random() * 10);
							const tag2 = Math.floor(Math.random() * 10);
							let pop = Math.floor((Math.random() * 100));
							pop = pop - pop % 5;
							const custags = [];
							custags.push(tags[tag1].tag);
							custags.push(tags[tag2].tag);
							const gender = (e.gender == "male")?0:1;
							const photo = (e.gender == "male")?'3b230cbab721c0f37a5f4c4f93bc77fb':'f07e74abf1945561bd11faec4666f108';
							return [e.name, e.firstname, e.username, e.email, e.city, gender, e.age, e.password, JSON.stringify(custags), photo, pop];
						})
						db.query("INSERT INTO users (name, firstname, username, email, location, gender, age, hash, tags, photo1, pop) VALUES ?", [toLoad], (err, res) => {
							if (err) {
								return reject(err);
							} else {
								resolve();
							}
						});
					}
				})
			}
		});
	})
}

exports.signUp = (fname, name, uname, email, pass, conf, gender) => {
	return new Promise(async (resolve, reject) => {
		const regexp = /[a-z]+[1-9]+/i;
		if (pass.length < 8 || !regexp.test(pass)) {
			reject("Le mot de passe doit contenir au moins 8 caracteres, des chiffres et des lettres");
		}
		if (pass != conf) {
			reject("Le mot de passe et sa confirmation ne correspondent pas");
		}
		const hash = await bcrypt.hash(pass, 10);
		const tmp_hash = Math.floor(Math.random() * 1000000000);
		db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
			if (err) {
				reject(err);
			} else {
				if (data[0]) {
					reject("Cette adresse email a déjà été utilisée");
				} else {
					db.query("INSERT INTO users SET ?", {
						firstname: fname,
						name: name,
						username: uname,
						email: email,
						hash: hash,
						gender: gender,
						tmp_hash: tmp_hash
					}, async (err, res) => {
						if (err) {
							throw err;
						} else {
							ejs.renderFile('./templates/inscription.ejs', { firstname: fname, host: mainConfig.host, tmp_hash: tmp_hash }, function (err, data) {
								if (err) {
									reject(err);
								} else {
									mail.sendMail(email, 'Inscription à Matcha', data);
									resolve();
								}
							});
						}
					});
				}
			}
		})
	});
};

exports.signIn = (email, password) => {
	return new Promise(function(resolve, reject) {
		console.log("Entering signin data process with email "+email);
		db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
			if (err) {
				reject(err);
			} else if (!data[0]) {
				console.log("Authentification : no user with this email");
				reject("Utilisateur inconnu");
			} else {
				bcrypt.compare(password, data[0].hash, (err, res) => {
					if (res) {
						console.log("Authentification : success for user "+data[0].id);
						resolve(data[0].id);
					} else {
						reject("Informations de connexion incorrectes");
						console.log("Authentification : fail, password does not match");
					}
				});
			}
		});
	});
}

exports.updateTime = (id) => {
	return new Promise((resolve, reject) => {
		db.query("UPDATE users SET lastonline = NOW() WHERE id = ?", [id], (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

exports.get = (id) => {
	return new Promise((resolve, reject) => {
		console.log("Getting user "+id);
		db.query("SELECT id, name, firstname, username, email, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags, fake, lastonline FROM users WHERE id = ?", [id], (err, data) => {
			if (err) {
				reject(err);
			} else if (!data[0]) {
				reject(new Error("Utilisateur introuvable"));
			} else {
				const lastonline = new Date(data[0].lastonline);
				const textonline = lastonline.getDate()+'/'+(lastonline.getMonth()+1)+'/'+lastonline.getFullYear()+' à '+lastonline.getHours()+':'+lastonline.getMinutes()+':'+lastonline.getSeconds();
				data[0].lastonline = textonline;
				resolve(data[0]);
			}
		})
	});
}

exports.getAll = (me) => {
	return new Promise((resolve, reject) => {
		db.query("SELECT location, interest, tags FROM users WHERE id = ?", [me], (err, mydata) => {
			console.log(mydata[0]);
			if (err) {
				return reject(err);
			} else if (!mydata[0] || !mydata[0].location || JSON.parse(mydata[0].tags).length <= 0) {
				return reject("Veuillez compléter votre profil avec votre localisation et des tags d'intérêt");
			} else {
				db.query("SELECT * FROM blocks WHERE owner = ?", [me], (err, blocked) => {
					if (err) {
						reject(err);
					} else {
						db.query("SELECT id, name, firstname, username, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags FROM users WHERE id != ?", [me], async (err, data) => {
							if (err) {
								reject(err);
							} else {
								data.splice(100);
								
								// On vire les bloqués

								data = data.filter((e) => {
									for(let f in blocked) {
										if (blocked[f].target == e.id) {
											return false;
										}
									}
									return true;
								});

								// Tri des sexes, on dégage ce qui nous interesse pas

								data = data.filter((elem) => {
									if ((mydata[0].interest == 2 || mydata[0].interest == 1) && elem.gender == 1) {
										return true;
									}
									if ((mydata[0].interest == 2 || mydata[0].interest == 0) && elem.gender == 0) {
										return true;
									}
									return false
								});

								// On colle un ptit score de matching sur tags

								const mytags = JSON.parse(mydata[0].tags);

								data = data.map((elem) => {
									let score = 0;
									const toCheck = JSON.parse(elem.tags);
									for(var i in mytags) {
										for (var j in toCheck) {
											if (mytags[i] == toCheck[j]) {
												score++;
											}
										}
									}
									elem.score = score;
									return elem;
								});

								const limit = data.length;
								let i = 0;
								while (i < limit) {
									try {
										if (mydata[0].location && data[i].location != null) {
											console.log(data[i].location);
											const res = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+mydata[0].location+'&destinations='+data[i].location+'&key=AIzaSyAQQdupWzfhiBYyCjdiG5RJfN1r04mhv9w');
											const parsed = await res.json();
											if (parsed && parsed.rows && parsed.rows[0] && parsed.rows[0].elements) {
												const distance = parsed.rows[0].elements[0].distance.value / 1000;
												data[i].distance = Math.floor(distance);
												if (i === limit - 1) {

													// On trie !
													// Distance first !

													data.sort((a, b) => {
														if (a.distance > b.distance) {
															return true;
														} else {
															return false;
														}
													});

													// Interets ensuite

													data.sort((a, b) => {
														if (a.score > b.score) {
															return true;
														} else {
															return false;
														}
													});

													data.sort((a, b) => {
														if (a.pop < b.pop) {
															return true;
														} else {
															return false;
														}
													})
													data.splice(10);
													resolve(data);
												}
											} else {
												data[i].distance = 0;
											}
										} else {
											data[i].distance = 0;
											if (i === limit - 1) {
												resolve(data);
											}
										}
									} catch (e) {
										reject(e);
									}
									i++;
								}
							}
						})
					}
				});
			}
		})
	});
}

exports.getFiltered = (me, ageMin, ageMax, popMin, popMax, tags, range) => {
	return new Promise((resolve, reject) => {
		console.log("Starting user listing");
		if (!ageMin) {
			ageMin = 0;
		}
		if (!ageMax) {
			ageMax = 1000;
		}
		if (!popMin) {
			popMin = -100000;
		}
		if (!popMax) {
			popMax = 1000000;
		}
		db.query("SELECT location, interest, tags FROM users WHERE id = ?", [me], (err, mydata) => {
			if (err) {
				reject(err);
			} else if (!mydata[0].location || !JSON.parse(mydata[0].tags).length) {
				reject("Veuillez compléter votre profil avec votre localisation et des tags d'intérêt");
			} else {
				db.query("SELECT * FROM blocks WHERE owner = ?", [me], (err, blocked) => {
					if (err) {
						reject(err);
					} else {
						db.query("SELECT id, name, firstname, username, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags FROM users WHERE id != ? AND age >= ? AND age <= ? AND pop >= ? AND pop <= ? ", [me, ageMin, ageMax, popMin, popMax], async (err, data) => {
							if (err) {
								reject(err);
							} else {
								data.splice(100);
								// On vire les bloqués

								data = data.filter((e) => {
									for(let f in blocked) {
										if (f.target == e.id) {
											return false;
										}
									}
									return true;
								});

								// Tri des sexes, on dégage ce qui nous interesse pas

								data = data.filter((elem) => {
									if ((mydata[0].interest == 2 || mydata[0].interest == 1) && elem.gender == 1) {
										return true;
									}
									if ((mydata[0].interest == 2 || mydata[0].interest == 0) && elem.gender == 0) {
										return true;
									}
									return false
								});

								// On colle un ptit score de matching sur tags

								const mytags = JSON.parse(mydata[0].tags);

								data = data.map((elem) => {
									let score = 0;
									const toCheck = JSON.parse(elem.tags);
									for(var i in mytags) {
										for (var j in toCheck) {
											if (mytags[i] == toCheck[j]) {
												score++;
											}
										}
									}
									elem.score = score;
									return elem;
								});

								const limit = data.length;
								let i = 0;
								while (i < limit) {
									try {
										const res = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+mydata[0].location+'&destinations='+data[i].location+'&key=AIzaSyAQQdupWzfhiBYyCjdiG5RJfN1r04mhv9w');
										const parsed = await res.json();
										if (parsed && parsed.rows && parsed.rows[0] ) {
											const distance = parsed.rows[0].elements[0].distance.value / 1000;
											data[i].distance = Math.floor(distance);
											if (i === limit - 1) {
												data = data.filter((one) => {
													if (one.distance <= range) {
														return true;
													} else {
														return false;
													}
												})
												data = data.filter((one) => {
													const ref = JSON.parse(tags);
													if (ref.length == 0) {
														return true;
													}
													const toCheck = JSON.parse(one.tags);
													for(var i in ref) {
														console.log(ref[i]);
														for (var j in toCheck) {
															console.log(toCheck[j]);
															if (ref[i] == toCheck[j]) {
																return true;
															}
														}
													}
													return false;
												});

												// On trie !
												// Distance first !

												data.sort((a, b) => {
													if (a.distance > b.distance) {
														return true;
													} else {
														return false;
													}
												});

												// Interets ensuite

												data.sort((a, b) => {
													if (a.score > b.score) {
														return true;
													} else {
														return false;
													}
												});

												data.sort((a, b) => {
													if (a.pop < b.pop) {
														return true;
													} else {
														return false;
													}
												})
												data.splice(10);
												resolve(data);
											}
										} else {
											data[i].distance = 0;
										}
									} catch (e) {
										reject(e);
									}
									i++;
								}
							}
						})
					}
				});
			}
		});
	});
}

exports.update = (id, firstname, name, username, password, confirmation, email, gender, interest, age, location, bio, photo1, photo2, photo3, photo4, photo5, tags) => {
	return new Promise(async (resolve, reject) => {
		let toUpdate = {};
		if (password && confirmation) {
			const regexp = /[a-z]+[1-9]+/i;
			if (password.length < 8 || !regexp.test(password)) {
				reject("Le mot de passe doit contenir au moins 8 caracteres, des chiffres et des lettres");
			}
			if (password != confirmation) {
				reject("Le mot de passe et sa confirmation ne correspondent pas");
			}
			const hash = await bcrypt.hash(password, 10);
			toUpdate = {
				name: name,
				firstname: firstname,
				email: email,
				username: username,
				hash: hash,
				gender: gender,
				interest: interest,
				age: age,
				location: location,
				bio: bio,
				tags: tags
			};
		} else {
			toUpdate = {
				name: name,
				firstname: firstname,
				email: email,
				username: username,
				gender: gender,
				interest: interest,
				age: age,
				location: location,
				bio: bio,
				tags: tags
			};
		}
		if (photo1) {
			toUpdate.photo1 = photo1;
		}
		if (photo2) {
			toUpdate.photo2 = photo2;
		}
		if (photo3) {
			toUpdate.photo3 = photo3;
		}
		if (photo4) {
			toUpdate.photo4 = photo4;
		}
		if (photo5) {
			toUpdate.photo5 = photo5;
		}
		db.query("UPDATE users SET ? WHERE id = ?", [toUpdate, id], (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	});
}

exports.validate = (hash) => {
	return new Promise(async (resolve, reject) => {
		db.query("UPDATE users SET ? WHERE tmp_hash = ?", [{ valide : 1 }, hash], (err, data) => {
			if (err) {
				reject(err);
			} else {
				if (data.changedRows == 1) {
					resolve();
				} else {
					reject("Le compte n'a pas pu être validé. Il l'est probablement déjà.");
				}
			}
		});
	});
}

exports.forgot = (email) => {
	return new Promise( async (resolve, reject) => {
		db.query("SELECT firstname, tmp_hash FROM users WHERE email = ?", [email], (err, data) => {
			if (err) {
				reject(err);
			} else {
				if (!data[0]) {
					reject("Aucun utilisateur ne correspond à cette adresse email");
				} else {
					ejs.renderFile('./templates/forgot.ejs', { firstname: data[0].firstname, host: mainConfig.host, tmp_hash: data[0].tmp_hash }, function (err, data) {
						if (err) {
							reject(err);
						} else {
							mail.sendMail(email, 'Mot de passe oublié sur Matcha', data);
							resolve("Un email vous permettant de créer un nouveau mot de passe vient de vous être envoyé.");
						}
					});
				}
			}
		})
	});
}

exports.fakeToggle = (from, to) => {
	return new Promise((resolve, reject) => {
		db.query("SELECT fake FROM users WHERE id = ?", [to], async (err, data) => {
			if (err) {
				return reject(err)
			} else {
				const fake = JSON.parse(data[0].fake);
				const index = fake.indexOf(from);
				if (index >= 0) {
					await popModel.alter(to, +25);
					fake.splice(index, 1);
				} else {
					await popModel.alter(to, -25);
					fake.push(from);
				}
				db.query("UPDATE users SET ? WHERE id = ?", [{ fake : JSON.stringify(fake) }, to], (err, data) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			}
		})
	});
}

exports.reset = (hash, password, confirmation) => {
	return new Promise ( async (resolve, reject) => {
		if (password != confirmation) {
			reject("Le mot de passe et sa confirmation ne correspondent pas");
		}
		const hashpass = await bcrypt.hash(password, 10);
		db.query("UPDATE users SET ? WHERE tmp_hash = ?", [{
			hash: hashpass
		}, hash], (err, data) => {
			if (err) {
				reject(err);
			} else if (data.changedRows == 0) {
				reject("Le mot de passe n'a pas pu être modifié");
			} else {
				resolve("Le mot de passe a bien été modifié");
			}
		})
		resolve();
	});
}
