namespace testGrap
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.panel1 = new System.Windows.Forms.Panel();
            this.button1 = new System.Windows.Forms.Button();
            this.groupEndDate = new System.Windows.Forms.GroupBox();
            this.PickerQueryEndDate = new System.Windows.Forms.DateTimePicker();
            this.label1 = new System.Windows.Forms.Label();
            this.groupStartDate = new System.Windows.Forms.GroupBox();
            this.PickerQueryStartDate = new System.Windows.Forms.DateTimePicker();
            this.label3 = new System.Windows.Forms.Label();
            this.button2 = new System.Windows.Forms.Button();
            this.button3 = new System.Windows.Forms.Button();
            this.button4 = new System.Windows.Forms.Button();
            this.groupEndDate.SuspendLayout();
            this.groupStartDate.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.SystemColors.ButtonFace;
            this.panel1.Location = new System.Drawing.Point(116, 137);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(600, 600);
            this.panel1.TabIndex = 0;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(116, 12);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(109, 67);
            this.button1.TabIndex = 1;
            this.button1.Text = "button1";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // groupEndDate
            // 
            this.groupEndDate.Controls.Add(this.PickerQueryEndDate);
            this.groupEndDate.Controls.Add(this.label1);
            this.groupEndDate.ImeMode = System.Windows.Forms.ImeMode.NoControl;
            this.groupEndDate.Location = new System.Drawing.Point(555, 9);
            this.groupEndDate.Name = "groupEndDate";
            this.groupEndDate.Size = new System.Drawing.Size(215, 88);
            this.groupEndDate.TabIndex = 21;
            this.groupEndDate.TabStop = false;
            // 
            // PickerQueryEndDate
            // 
            this.PickerQueryEndDate.CustomFormat = "yyyy\'-\'MM\'-\'dd HH\':\'00\':00";
            this.PickerQueryEndDate.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.5F);
            this.PickerQueryEndDate.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.PickerQueryEndDate.Location = new System.Drawing.Point(9, 41);
            this.PickerQueryEndDate.Name = "PickerQueryEndDate";
            this.PickerQueryEndDate.Size = new System.Drawing.Size(201, 23);
            this.PickerQueryEndDate.TabIndex = 0;
            this.PickerQueryEndDate.Value = new System.DateTime(2017, 9, 28, 23, 59, 0, 0);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.5F);
            this.label1.Location = new System.Drawing.Point(6, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(64, 17);
            this.label1.TabIndex = 19;
            this.label1.Text = "结束时间";
            // 
            // groupStartDate
            // 
            this.groupStartDate.Controls.Add(this.PickerQueryStartDate);
            this.groupStartDate.Controls.Add(this.label3);
            this.groupStartDate.Location = new System.Drawing.Point(321, 5);
            this.groupStartDate.Name = "groupStartDate";
            this.groupStartDate.Size = new System.Drawing.Size(215, 94);
            this.groupStartDate.TabIndex = 20;
            this.groupStartDate.TabStop = false;
            // 
            // PickerQueryStartDate
            // 
            this.PickerQueryStartDate.CustomFormat = "yyyy\'-\'MM\'-\'dd HH\':\'00\':00";
            this.PickerQueryStartDate.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.5F);
            this.PickerQueryStartDate.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.PickerQueryStartDate.Location = new System.Drawing.Point(11, 44);
            this.PickerQueryStartDate.Name = "PickerQueryStartDate";
            this.PickerQueryStartDate.Size = new System.Drawing.Size(198, 23);
            this.PickerQueryStartDate.TabIndex = 0;
            this.PickerQueryStartDate.Value = new System.DateTime(2017, 9, 27, 9, 21, 0, 0);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.5F);
            this.label3.Location = new System.Drawing.Point(6, 15);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(64, 17);
            this.label3.TabIndex = 19;
            this.label3.Text = "开始时间";
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(1, 191);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(109, 67);
            this.button2.TabIndex = 22;
            this.button2.Text = "button2";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(1, 386);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(109, 67);
            this.button3.TabIndex = 23;
            this.button3.Text = "button3";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
            // 
            // button4
            // 
            this.button4.Location = new System.Drawing.Point(1, 553);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(109, 67);
            this.button4.TabIndex = 24;
            this.button4.Text = "button4";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Click += new System.EventHandler(this.button4_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(803, 773);
            this.Controls.Add(this.button4);
            this.Controls.Add(this.button3);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.groupEndDate);
            this.Controls.Add(this.groupStartDate);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.panel1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.groupEndDate.ResumeLayout(false);
            this.groupEndDate.PerformLayout();
            this.groupStartDate.ResumeLayout(false);
            this.groupStartDate.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.GroupBox groupEndDate;
        private System.Windows.Forms.DateTimePicker PickerQueryEndDate;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox groupStartDate;
        private System.Windows.Forms.DateTimePicker PickerQueryStartDate;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button4;
    }
}

